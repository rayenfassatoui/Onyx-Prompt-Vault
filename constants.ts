import { Prompt } from './types';

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Code Refactor Expert',
    description: 'Optimize legacy code for performance and readability.',
    content: 'Act as a Senior Software Engineer. Refactor the following {{language}} code to improve {{metric}} and maintainability. \n\nCode snippet:\n```\n{{code}}\n```\n\nExplain your changes.',
    tags: ['Coding', 'Engineering'],
    createdAt: '2023-10-24',
  },
  {
    id: '2',
    title: 'Marketing Email Generator',
    description: 'Create high-conversion cold outreach emails.',
    content: 'Write a cold email to {{role}} at {{company}}. The goal is to sell {{product}}. The tone should be {{tone}}. Focus on the pain point of {{pain_point}}.',
    tags: ['Marketing', 'Sales', 'Copywriting'],
    createdAt: '2023-10-25',
  },
  {
    id: '3',
    title: 'UX Persona Creator',
    description: 'Generate detailed user personas for product design.',
    content: 'Create a detailed user persona for a {{product_type}} app. The target user is a {{age}} year old {{occupation}}. Include their goals, frustrations, and tech literacy level.',
    tags: ['Design', 'UX', 'Product'],
    createdAt: '2023-10-26',
  },
  {
    id: '4',
    title: 'SEO Article Writer',
    description: 'SEO-optimized blog posts based on keywords.',
    content: 'Write a {{word_count}} word blog post about {{topic}}. Include the keywords: {{keywords}}. Use a {{tone}} tone of voice. Structure with H2 and H3 headers.',
    tags: ['Content', 'SEO', 'Writing'],
    createdAt: '2023-10-27',
  },
  {
    id: '5',
    title: 'Midjourney Photorealism',
    description: 'Complex prompt structure for AI image generation.',
    content: '/imagine prompt: A hyper-realistic portrait of a {{subject}} in {{setting}}, shot on {{camera}}, {{lens}} lens, {{lighting}} lighting, 8k resolution, cinematic composition --ar {{aspect_ratio}}',
    tags: ['AI Art', 'Midjourney', 'Creative'],
    createdAt: '2023-10-28',
  },
   {
    id: '6',
    title: 'SQL Query Builder',
    description: 'Generate complex SQL queries from natural language.',
    content: 'Write a SQL query for {{database_type}} to find {{goal}}. The schema includes tables: {{tables}}. Ensure query performance is optimized.',
    tags: ['Data', 'SQL', 'Engineering'],
    createdAt: '2023-10-29',
  },
];

export const ACCESS_CODE = '1234';
