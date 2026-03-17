import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/db.js';

// Placeholder YouTube ID for demo (replace with real course video IDs in production)
const YT = 'dQw4w9WgXcQ';

const courses = [
  {
    id: 'subject-1',
    title: 'The Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.',
    imageUrl: 'https://picsum.photos/seed/webdev/400/225',
    instructorName: 'Angela Yu',
    level: 'Beginner',
    rating: 4.7,
    sections: [
      {
        id: 's1-1',
        title: 'Getting Started',
        videos: [
          { id: 'v1-1', title: 'Course Introduction', youtubeUrl: YT, duration: 320 },
          { id: 'v1-2', title: 'How to Get Help', youtubeUrl: YT, duration: 180 },
          { id: 'v1-3', title: 'Setting Up Your Development Environment', youtubeUrl: YT, duration: 450 },
        ],
      },
      {
        id: 's1-2',
        title: 'Introduction to HTML',
        videos: [
          { id: 'v1-4', title: 'What is HTML?', youtubeUrl: YT, duration: 280 },
          { id: 'v1-5', title: 'HTML Document Structure', youtubeUrl: YT, duration: 360 },
          { id: 'v1-6', title: 'Headings, Paragraphs, and Text', youtubeUrl: YT, duration: 420 },
        ],
      },
      {
        id: 's1-3',
        title: 'Intermediate HTML',
        videos: [
          { id: 'v1-7', title: 'Lists and Links', youtubeUrl: YT, duration: 380 },
          { id: 'v1-8', title: 'Images and Media', youtubeUrl: YT, duration: 410 },
        ],
      },
    ],
  },
  {
    id: 'subject-2',
    title: 'Python for Data Science and Machine Learning',
    description: 'Master Python for data analysis, visualization, and machine learning with Pandas, NumPy, Matplotlib, and Scikit-learn.',
    imageUrl: 'https://picsum.photos/seed/python/400/225',
    instructorName: 'Jose Portilla',
    level: 'All Levels',
    rating: 4.6,
    sections: [
      {
        id: 's2-1',
        title: 'Python Crash Course',
        videos: [
          { id: 'v2-1', title: 'Welcome to the Course', youtubeUrl: YT, duration: 200 },
          { id: 'v2-2', title: 'Variables and Data Types', youtubeUrl: YT, duration: 350 },
          { id: 'v2-3', title: 'Control Flow and Loops', youtubeUrl: YT, duration: 400 },
        ],
      },
      {
        id: 's2-2',
        title: 'NumPy and Pandas',
        videos: [
          { id: 'v2-4', title: 'Introduction to NumPy', youtubeUrl: YT, duration: 380 },
          { id: 'v2-5', title: 'DataFrames with Pandas', youtubeUrl: YT, duration: 450 },
        ],
      },
    ],
  },
  {
    id: 'subject-3',
    title: 'React - The Complete Guide',
    description: 'Dive deep into React. Hooks, Redux, React Router, Next.js, and build modern web applications.',
    imageUrl: 'https://picsum.photos/seed/react/400/225',
    instructorName: 'Maximilian Schwarzmüller',
    level: 'Intermediate',
    rating: 4.7,
    sections: [
      {
        id: 's3-1',
        title: 'Getting Started with React',
        videos: [
          { id: 'v3-1', title: 'What is React?', youtubeUrl: YT, duration: 280 },
          { id: 'v3-2', title: 'Creating Your First React App', youtubeUrl: YT, duration: 420 },
          { id: 'v3-3', title: 'Components and JSX', youtubeUrl: YT, duration: 380 },
        ],
      },
      {
        id: 's3-2',
        title: 'State and Events',
        videos: [
          { id: 'v3-4', title: 'useState Hook', youtubeUrl: YT, duration: 450 },
          { id: 'v3-5', title: 'Handling User Input', youtubeUrl: YT, duration: 360 },
        ],
      },
    ],
  },
  {
    id: 'subject-4',
    title: 'Node.js - The Complete Guide',
    description: 'Build scalable backend applications with Node.js, Express, MongoDB, and deploy to production.',
    imageUrl: 'https://picsum.photos/seed/nodejs/400/225',
    instructorName: 'Maximilian Schwarzmüller',
    level: 'All Levels',
    rating: 4.6,
    sections: [
      {
        id: 's4-1',
        title: 'Node.js Fundamentals',
        videos: [
          { id: 'v4-1', title: 'Introduction to Node.js', youtubeUrl: YT, duration: 300 },
          { id: 'v4-2', title: 'Modules and NPM', youtubeUrl: YT, duration: 350 },
          { id: 'v4-3', title: 'The Event Loop', youtubeUrl: YT, duration: 400 },
        ],
      },
      {
        id: 's4-2',
        title: 'Express.js',
        videos: [
          { id: 'v4-4', title: 'Setting Up Express', youtubeUrl: YT, duration: 320 },
          { id: 'v4-5', title: 'Routes and Middleware', youtubeUrl: YT, duration: 450 },
        ],
      },
    ],
  },
  {
    id: 'subject-5',
    title: 'JavaScript - From Zero to Hero',
    description: 'Learn modern JavaScript (ES6+), DOM manipulation, async/await, and build projects from scratch.',
    imageUrl: 'https://picsum.photos/seed/javascript/400/225',
    instructorName: 'Jonas Schmedtmann',
    level: 'Beginner',
    rating: 4.8,
    sections: [
      {
        id: 's5-1',
        title: 'JavaScript Basics',
        videos: [
          { id: 'v5-1', title: 'Welcome to JavaScript', youtubeUrl: YT, duration: 250 },
          { id: 'v5-2', title: 'Variables: let, const, var', youtubeUrl: YT, duration: 380 },
          { id: 'v5-3', title: 'Functions and Scope', youtubeUrl: YT, duration: 420 },
        ],
      },
      {
        id: 's5-2',
        title: 'DOM and Events',
        videos: [
          { id: 'v5-4', title: 'Selecting and Manipulating Elements', youtubeUrl: YT, duration: 400 },
          { id: 'v5-5', title: 'Event Listeners', youtubeUrl: YT, duration: 350 },
        ],
      },
    ],
  },
];

async function main() {
  const hashed = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@lms.com' },
    update: {},
    create: {
      email: 'demo@lms.com',
      password: hashed,
    },
  });
  console.log('Demo user:', user.email);

  for (const course of courses) {
    const { sections: sectionData, ...subjectData } = course;
    const subject = await prisma.subject.upsert({
      where: { id: course.id },
      update: {
        title: subjectData.title,
        description: subjectData.description,
        imageUrl: subjectData.imageUrl,
        instructorName: subjectData.instructorName,
        level: subjectData.level,
        rating: subjectData.rating,
      },
      create: {
        id: subjectData.id,
        title: subjectData.title,
        description: subjectData.description,
        imageUrl: subjectData.imageUrl,
        instructorName: subjectData.instructorName,
        level: subjectData.level,
        rating: subjectData.rating,
      },
    });

    for (const sec of sectionData) {
      const section = await prisma.section.upsert({
        where: { id: sec.id },
        update: {},
        create: {
          id: sec.id,
          subjectId: subject.id,
          title: sec.title,
        },
      });
      for (const vid of sec.videos) {
        await prisma.video.upsert({
          where: { id: vid.id },
          update: {},
          create: {
            id: vid.id,
            sectionId: section.id,
            title: vid.title,
            youtubeUrl: vid.youtubeUrl,
            duration: vid.duration,
          },
        });
      }
    }
    console.log('Course:', subject.title);
  }

  console.log('All Udemy-style courses seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
