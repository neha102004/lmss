import prisma from '../config/db.js';

/**
 * GET /videos/:id - get single video by id
 */
export async function getVideoById(req, res) {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            subject: true,
          },
        },
      },
    });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (err) {
    console.error('getVideoById:', err);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
}
