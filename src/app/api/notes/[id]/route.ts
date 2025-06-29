import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Note, UpdateNoteRequest } from '@/types';

// GET /api/notes/[id] - Get a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = await connectToDatabase();
    const note = await db.collection('notes').findOne({
      _id: new ObjectId(id),
      userId,
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    const responseNote: Note = {
      id: note._id.toString(),
      userId: note.userId,
      title: note.title,
      content: note.content,
      weather: note.weather,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };

    return NextResponse.json(responseNote);
  } catch (error) {
    console.error('Failed to fetch note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - Update a note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data: UpdateNoteRequest = await request.json();
    const db = await connectToDatabase();

    const result = await db.collection('notes').findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      {
        $set: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    const updatedNote: Note = {
      id: result._id.toString(),
      userId: result.userId,
      title: result.title,
      content: result.content,
      weather: result.weather,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Failed to update note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = await connectToDatabase();
    const result = await db.collection('notes').deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    // 204 No Content - 성공적으로 삭제되었지만 응답 본문 없음
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 