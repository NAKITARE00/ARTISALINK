import connectDB from '@/config/db';
import Role from '@/models/Role';

export async function POST(request) {
    try {
        await connectDB();
        const { _id, name, role } = await request.json();

        // Validate required fields including _id
        if (!_id || !name || !role) {
            return Response.json(
                { success: false, message: 'All fields including ID are required' },
                { status: 400 }
            );
        }

        // Create new role with provided _id
        const newRole = new Role({
            _id, // Using the provided ID
            name,
            role
        });

        await newRole.save();

        return Response.json(
            {
                success: true,
                message: 'Role created successfully',
                role: newRole
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating role:', error);
        return Response.json(
            {
                success: false,
                message: error.code === 11000
                    ? 'Role with this ID already exists'
                    : 'Failed to create role'
            },
            { status: 500 }
        );
    }
}


