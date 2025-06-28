import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Note, CreateNoteRequest } from '@/types';
import { Descendant } from 'slate';

// GET /api/notes - Get all notes for the authenticated user
export async function GET() {
  try {
    const { userId } = auth();
    console.log('Fetching notes for userId:', userId)
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const db = await connectToDatabase();
    const notes = await db.collection('notes')
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();

    console.log('Found notes:', notes.length)
    console.log('Notes data:', notes.map(note => ({ id: note._id.toString(), title: note.title })))

    // Transform MongoDB documents to Note objects
    const transformedNotes = notes.map(note => ({
      id: note._id.toString(),
      userId: note.userId,
      title: note.title,
      content: note.content,
      weather: note.weather,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));

    console.log('Transformed notes:', transformedNotes.map(note => ({ id: note.id, title: note.title })))
    return NextResponse.json(transformedNotes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    console.log('Creating note for userId:', userId)
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data: CreateNoteRequest = await request.json();
    console.log('Note data received:', data)
    
    if (!data.title || !data.content) {
      return new NextResponse('Title and content are required', { status: 400 });
    }

    const db = await connectToDatabase();
    const now = new Date().toISOString();

    const note: Omit<Note, 'id'> = {
      userId,
      title: data.title,
      content: data.content,
      weather: data.weather,
      createdAt: now,
      updatedAt: now,
    };

    console.log('Inserting note into database:', note)
    const result = await db.collection('notes').insertOne(note);
    console.log('Insert result:', result)
    
    const createdNote: Note = {
      id: result.insertedId.toString(),
      ...note,
    };

    console.log('Created note with ID:', createdNote.id)
    return NextResponse.json(createdNote);
  } catch (error) {
    console.error('Failed to create note:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 