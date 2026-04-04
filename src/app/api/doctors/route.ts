import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/doctors - Return all doctors
export async function GET() {
  try {
    const doctors = await db.doctor.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Doctors fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/doctors - Create a new doctor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, specialty, status, patientsToday, maxPatients } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!specialty || typeof specialty !== "string" || specialty.trim().length === 0) {
      return NextResponse.json(
        { error: "Specialty is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (status !== undefined && !["Available", "Busy", "Offline"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be one of: Available, Busy, Offline" },
        { status: 400 }
      );
    }

    if (patientsToday !== undefined && (typeof patientsToday !== "number" || patientsToday < 0)) {
      return NextResponse.json(
        { error: "patientsToday must be a non-negative number" },
        { status: 400 }
      );
    }

    if (maxPatients !== undefined && (typeof maxPatients !== "number" || maxPatients <= 0)) {
      return NextResponse.json(
        { error: "maxPatients must be a positive number" },
        { status: 400 }
      );
    }

    const doctor = await db.doctor.create({
      data: {
        name: name.trim(),
        specialty: specialty.trim(),
        status: status || "Available",
        patientsToday: patientsToday !== undefined ? patientsToday : 0,
        maxPatients: maxPatients !== undefined ? maxPatients : 20,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("Doctor create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/doctors - Update a doctor by id
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, specialty, status, patientsToday, maxPatients } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Doctor id is required" },
        { status: 400 }
      );
    }

    // Check doctor exists
    const existing = await db.doctor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    // Validate fields if provided
    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      return NextResponse.json(
        { error: "Name must be a non-empty string" },
        { status: 400 }
      );
    }

    if (specialty !== undefined && (typeof specialty !== "string" || specialty.trim().length === 0)) {
      return NextResponse.json(
        { error: "Specialty must be a non-empty string" },
        { status: 400 }
      );
    }

    if (status !== undefined && !["Available", "Busy", "Offline"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be one of: Available, Busy, Offline" },
        { status: 400 }
      );
    }

    if (patientsToday !== undefined && (typeof patientsToday !== "number" || patientsToday < 0)) {
      return NextResponse.json(
        { error: "patientsToday must be a non-negative number" },
        { status: 400 }
      );
    }

    if (maxPatients !== undefined && (typeof maxPatients !== "number" || maxPatients <= 0)) {
      return NextResponse.json(
        { error: "maxPatients must be a positive number" },
        { status: 400 }
      );
    }

    const doctor = await db.doctor.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(specialty !== undefined && { specialty: specialty.trim() }),
        ...(status !== undefined && { status }),
        ...(patientsToday !== undefined && { patientsToday }),
        ...(maxPatients !== undefined && { maxPatients }),
      },
    });

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Doctor update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/doctors?id=<id> - Delete a doctor by id
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    // Fallback to body if id not in query params
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // Body may be empty, that's fine
      }
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Doctor id is required (via query param or body)" },
        { status: 400 }
      );
    }

    // Check doctor exists
    const existing = await db.doctor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    await db.doctor.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Doctor delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
