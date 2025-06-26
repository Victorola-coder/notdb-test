import { NextRequest, NextResponse } from "next/server";
import { createClient } from "notdb";

// Initialize NotDatabase client with schema
const db = createClient({
  apiKey: process.env.NOTDB_API_KEY!,
  schema: {
    tasks: {
      properties: {
        title: { type: "string", required: true },
        completed: { type: "boolean", required: true },
      },
    },
  },
});

// GET - Read all tasks
export async function GET() {
  try {
    // Get all tasks (we'll use find without params to get all)
    const tasks = await db.tasks.find();
    const count = await db.tasks.count();

    return NextResponse.json({
      success: true,
      data: tasks,
      count: count,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST - Create new task(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's bulk insert (array) or single insert
    if (Array.isArray(body)) {
      // Bulk insert
      const tasks = await db.tasks.insertBulk(body);
      return NextResponse.json({
        success: true,
        data: tasks,
        message: `${body.length} tasks created successfully`,
      });
    } else {
      // Single insert
      const task = await db.tasks.insert(body);
      return NextResponse.json({
        success: true,
        data: task,
        message: "Task created successfully",
      });
    }
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 }
    );
  }
}
