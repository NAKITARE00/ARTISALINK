import connectDB from '@/config/db';
import Role from '@/models/Role';

export async function GET() {
    try {
        await connectDB();

        const roles = await Role.find();

        return Response.json(
            {
                success: true,
                roles
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching roles:', error);
        return Response.json(
            {
                success: false,
                message: 'Failed to fetch roles'
            },
            { status: 500 }
        );
    }
}
