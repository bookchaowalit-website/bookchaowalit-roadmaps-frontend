import { notFound } from "next/navigation";
import Link from "next/link";
import { getRoadmapBySlug } from "@/lib/mdx";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const { getAllRoadmaps } = await import('@/lib/mdx');
  const roadmaps = await getAllRoadmaps();
  return roadmaps.map((roadmap) => ({
    slug: roadmap.slug,
  }));
}

export default async function RoadmapPage({ params }: PageProps) {
  const roadmap = await getRoadmapBySlug(params.slug);

  if (!roadmap) {
    notFound();
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/roadmaps"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back to Roadmaps
          </Link>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {roadmap.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      {roadmap.category}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(roadmap.difficulty)}`}>
                      {roadmap.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {roadmap.progress}%
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Estimated Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{roadmap.estimated_time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Stages:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{roadmap.stages.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Prerequisites:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{roadmap.prerequisites.length}</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${roadmap.progress}%` }}
                ></div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prerequisites</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.prerequisites.map((prereq, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Stages</h2>

            {roadmap.stages.map((stage, stageIndex) => (
              <div key={stageIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    {stageIndex + 1}
                  </span>
                  {stage.name}
                </h3>
                <ul className="space-y-2">
                  {stage.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}