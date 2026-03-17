import prisma from '../config/db.js';

/**
 * GET /subjects - list all subjects (courses)
 */
export async function getSubjects(req, res) {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { title: 'asc' },
      include: {
        sections: {
          orderBy: { title: 'asc' },
          include: {
            videos: { orderBy: { title: 'asc' } },
          },
        },
      },
    });
    res.json(subjects);
  } catch (err) {
    console.error('getSubjects:', err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
}

/**
 * GET /subjects/:id - single subject with sections and videos
 */
export async function getSubjectById(req, res) {
  try {
    const { id } = req.params;
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { title: 'asc' },
          include: {
            videos: { orderBy: { title: 'asc' } },
          },
        },
      },
    });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (err) {
    console.error('getSubjectById:', err);
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
}
