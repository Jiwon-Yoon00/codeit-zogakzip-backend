import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// �Խñ� ��� 
export const createPost = async (req, res) => {
    const { groupId } = req.params;
    const {
        nickname,
        title,
        content,
        postPassword,
        groupPassword,
        imageUrl,
        tags,
        location,
        moment,
        isPublic
    } = req.body;

    // ��û ���� ��ȿ�� �˻�
    if (!nickname || !title || !content || !postPassword || !groupPassword || !imageUrl || !moment) {
        return res.status(400).json({ message: "�߸��� ��û�Դϴ�" });
    }

    try {
        // �׷� ���� Ȯ�� �� ��й�ȣ ����
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            return res.status(404).json({ message: "�׷��� �������� �ʽ��ϴ�" });
        }

        const isGroupPasswordValid = await bcrypt.compare(groupPassword, group.password);

        if (!isGroupPasswordValid) {
            return res.status(403).json({ message: "�׷� ��й�ȣ�� Ʋ�Ƚ��ϴ�" });
        }

        // �Խñ� ��й�ȣ �ؽ�
        const hashedPostPassword = await bcrypt.hash(postPassword, 10);

        // �Խñ� ����
        const newPost = await prisma.post.create({
            data: {
                groupId: parseInt(groupId),
                nickname,
                title,
                content,
                password: hashedPostPassword,
                imageUrl,
                tags: tags,  // �迭�� ����
                location,
                moment: new Date(moment),  // ���ڿ� ��¥�� Date ��ü�� ��ȯ
                isPublic,
                likeCount: 0,
                commentCount: 0,
            }
        });
   
        // ���������� ������ �Խñ� ��ȯ
        res.status(200).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: '���� �����Դϴ�' });
    }
};

// �Խñ� ��� ��ȸ 
export const getPosts = async (req, res) => {
    const { groupId } = req.params;
    const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSizeNumber = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
    const isPublicBoolean = isPublic !== undefined ? isPublic === 'true' : undefined;

    let orderBy;
    switch (sortBy) {
        case 'mostCommented':
            orderBy = { commentCount: 'desc' };
            break;
        case 'mostLiked':
            orderBy = { likeCount: 'desc' };
            break;
        case 'latest':
        default:
            orderBy = { createdAt: 'desc' };
            break;
    }

    try {
        const whereClause = {
            groupId: parseInt(groupId),
            title: {
                contains: keyword,
                mode: 'insensitive',
            },
            ...(isPublicBoolean !== undefined && { isPublic: isPublicBoolean })
        };

        const [totalItemCount, posts] = await Promise.all([
            prisma.post.count({ where: whereClause }),
            prisma.post.findMany({
                where: whereClause,
                orderBy,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                select: {  // ���������� �ʵ常 ��ȯ
                    id: true,
                    nickname: true,
                    title: true,
                    imageUrl: true,
                    tags: true,
                    location: true,
                    moment: true,
                    isPublic: true,
                    likeCount: true,
                    commentCount: true,
                    createdAt: true,
                    // password �ʵ带 �����մϴ�.
                },
            }),
        ]);

        const totalPages = Math.ceil(totalItemCount / pageSizeNumber);

        res.status(200).json({
            currentPage: pageNumber,
            totalPages,
            totalItemCount,
            data: posts,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: '���� �����Դϴ�' });
    }
};

// �Խñ� ���� 
export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const {
        nickname,
        title,
        content,
        postPassword,
        imageUrl,
        tags,
        location,
        moment,
        isPublic
    } = req.body;

    // ��û ���� ��ȿ�� �˻�
    if (!nickname || !title || !content || !postPassword || !imageUrl || !moment) {
        return res.status(400).json({ message: "�߸��� ��û�Դϴ�" });
    }

    try {
        // �Խñ� ���� Ȯ��
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ message: "�������� �ʽ��ϴ�" });
        }

        // ��й�ȣ ����
        const isPasswordValid = await bcrypt.compare(postPassword, post.password);

        if (!isPasswordValid) {
            return res.status(403).json({ message: "��й�ȣ�� Ʋ�Ƚ��ϴ�" });
        }

        // �Խñ� ����
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(postId) },
            data: {
                nickname,
                title,
                content,
                imageUrl,
                tags,
                location,
                moment: new Date(moment),
                isPublic,
            },
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: '���� �����Դϴ�' });
    }
};

// �Խñ� ���� 
export const deletePost = async (req, res) => {
    const { postId } = req.params;
    const { postPassword } = req.body;

    // ��û ���� ��ȿ�� �˻�
    if (!postPassword) {
        return res.status(400).json({ message: '�߸��� ��û�Դϴ�' });
    }

    try {
        // �Խñ� ���� Ȯ��
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ message: "�Խñ��� �������� �ʽ��ϴ�" });
        }

        // ��й�ȣ ����
        const isPasswordValid = await bcrypt.compare(postPassword, post.password);

        if (!isPasswordValid) {
            return res.status(403).json({ message: "��й�ȣ�� Ʋ�Ƚ��ϴ�" });
        }

        // �Խñ� ����
        await prisma.post.delete({
            where: { id: parseInt(postId) },
        });

        res.status(200).json({ message: "�Խñ��� �����Ǿ����ϴ�" });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: '���� �����Դϴ�' });
    }
};

//�׷� �� ���� ��ȸ 
export const getPostDetails = async (req, res) => {
    const { postId } = req.params;

    // ��û ���� ��ȿ�� �˻�
    if (!postId || isNaN(postId)) {
        return res.status(400).json({ message: "�߸��� ��û�Դϴ�" });
    }

    try {
        // �Խñ� ���� Ȯ�� �� �� ���� ��ȸ
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: {  // select�� ����Ͽ� password �ʵ带 ����
                id: true,
                groupId: true,
                nickname: true,
                title: true,
                content: true,
                imageUrl: true,
                tags: true,
                location: true,
                moment: true,
                isPublic: true,
                likeCount: true,
                commentCount: true,
                createdAt: true,
                // password �ʵ带 ��������� ����
            },
        });

        if (!post) {
            return res.status(404).json({ message: "�������� �ʽ��ϴ�" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ message: '���� �����Դϴ�' });
    }
};

//�Խñ� ���� ���� Ȯ�� 
export const getPostPublicStatus = async (req, res) => {
    const { postId } = req.params;

    // ��û ���� ��ȿ�� �˻�
    if (!postId || isNaN(postId)) {
        return res.status(400).json({ message: "�߸��� ��û�Դϴ�" });
    }

    try {
        // �Խñ� ���� Ȯ�� �� ���� ���� ��ȸ
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: {
                id: true,
                isPublic: true,
            },
        });

        if (!post) {
            return res.status(404).json({ message: "�������� �ʽ��ϴ�" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post public status:', error);
        res.status(500).json({ message: '���� �����Դϴ�' });
    }
};

//�Խñ� �����ϱ� 
export const likePost = async (req, res) => {
    const { postId } = req.params;

    try {
        // �Խñ� ���� Ȯ��
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ message: '�������� �ʽ��ϴ�' });
        }

        // �Խñ� ���� �� ����
        await prisma.post.update({
            where: { id: parseInt(postId) },
            data: {
                likeCount: post.likeCount + 1,
            },
        });


        res.status(200).json({ message: '�Խñ� �����ϱ� ����' });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: '���� �����Դϴ�' });
    }
};

//�Խñ� ��ȸ ��ȯ Ȯ�� 
export const verifyPostPassword = async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;

    // ��û ���� ��ȿ�� �˻�
    if (!password) {
        return res.status(400).json({ message: '��й�ȣ�� ������ �ּ���' });
    }

    try {
        // �Խñ� ���� Ȯ��
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ message: '�������� �ʽ��ϴ�' });
        }

        // ��й�ȣ ����
        const isPasswordValid = await bcrypt.compare(password, post.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: '��й�ȣ�� Ʋ�Ƚ��ϴ�' });
        }

        res.status(200).json({ message: '��й�ȣ�� Ȯ�εǾ����ϴ�' });
    } catch (error) {
        console.error('Error verifying post password:', error);
        res.status(500).json({ message: '���� �����Դϴ�' });
    }
};