import prisma from '../config/db.js';

/**
 * POST /progress - save or update video progress
 * Body: { videoId, lastPosition, isCompleted }
 * - Track every 5 sec: lastPosition in seconds
 * - On complete: isCompleted = true
 */
export async function saveProgress(req, res) {
  try {
    const userId = req.userId;
    const { videoId, lastPosition, isCompleted } = req.body;

    if (!videoId) {
      return res.status(400).json({ error: 'videoId required' });
    }

    const data = {
      userId,
      videoId,
      lastPosition: typeof lastPosition === 'number' ? lastPosition : 0,
      isCompleted: Boolean(isCompleted),
    };

    const progress = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: { userId, videoId },
      },
      create: data,
      update: data,
    });

    res.json(progress);
  } catch (err) {
    console.error('saveProgress:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
}

/**
 * GET /progress/:videoId - get progress for a video (for resume)
 */
export async function getProgress(req, res) {
  try {
    const userId = req.userId;
    const { videoId } = req.params;

    const progress = await prisma.videoProgress.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });

    res.json(
      progress
        ? {
            lastPosition: progress.lastPosition,
            isCompleted: progress.isCompleted,
          }
        : { lastPosition: 0, isCompleted: false }
    );
  } catch (err) {
    console.error('getProgress:', err);
    res.status(500).json({ error: 'Failed to get progress' });
  }
}

/**
 * GET /progress - get all progress for user (for sidebar lock/unlock)
 */
export async function getAllProgress(req, res) {
  try {
    const userId = req.userId;
    const list = await prisma.videoProgress.findMany({
      where: { userId },
      select: { videoId: true, lastPosition: true, isCompleted: true },
    });
    const map = Object.fromEntries(
      list.map((p) => [p.videoId, { lastPosition: p.lastPosition, isCompleted: p.isCompleted }])
    );
    res.json(map);
  } catch (err) {
    console.error('getAllProgress:', err);
    res.status(500).json({ error: 'Failed to get progress' });
  }
}
