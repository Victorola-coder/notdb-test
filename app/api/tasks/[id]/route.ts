import { NextRequest, NextResponse } from "next/server";
import { createClient } from "notdb";

// Initialize NotDatabase client with schema
const db = createClient({
  apiKey: "J_Kt8BTlqAfyjPbYeC4QOwu4kTZqhAIN",
  schema: {
    tasks: {
      properties: {
        title: { type: "string", required: true },
        completed: { type: "boolean", required: true },
      },
    },
  },
});

// GET - Read single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await db.tasks.find({ filter: { _id: params.id } });

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: "Task fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT - Update task by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedTask = await db.tasks.update(params.id, body);

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE - Delete task by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.tasks.delete(params.id);

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
