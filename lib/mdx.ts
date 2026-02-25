import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface RoadmapStage {
  name: string;
  items: string[];
}

export interface Roadmap {
  title: string;
  category: string;
  progress: string;
  difficulty: string;
  estimated_time: string;
  prerequisites: string[];
  stages: RoadmapStage[];
  slug: string;
  content: string;
}

export async function getAllRoadmaps() {
  const contentDir = path.join(process.cwd(), 'content', 'roadmaps');
  const files = await fs.readdir(contentDir);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  const roadmaps = await Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        ...data,
        slug: file.replace('.mdx', ''),
        content
      } as Roadmap;
    })
  );

  return roadmaps.sort((a, b) => {
    const progressA = parseInt(a.progress) || 0;
    const progressB = parseInt(b.progress) || 0;
    return progressB - progressA;
  });
}

export async function getRoadmapBySlug(slug: string) {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'roadmaps');
    const filePath = path.join(contentDir, `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      ...data,
      slug,
      content: content
    } as Roadmap;
  } catch (error) {
    return null;
  }
}

export async function getRoadmapsByCategory(category: string) {
  const allRoadmaps = await getAllRoadmaps();
  return allRoadmaps.filter(roadmap => roadmap.category === category);
}