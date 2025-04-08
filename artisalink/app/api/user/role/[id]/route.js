import connectDB from '@/config/db';
import Role from '@/models/Role';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = params;

        if (!id) {
            return Response.json(
                { success: false, message: 'Role ID is required' },
                { status: 400 }
            );
        }

        const role = await Role.findById(id);

        if (!role) {
            return Response.json(
                { success: false, message: 'Role not found' },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, role },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching role by ID:', error);
        return Response.json(
            { success: false, message: 'Failed to fetch role' },
            { status: 500 }
        );
    }
}
