export type SkillCategory = 'Core Skills' | 'Tools & Technologies' | 'Currently Exploring';

export interface Skill {
  name: string;
  category: SkillCategory;
}

// No proficiency percentages/bars by design — see blueprint Section 5 (Skills).
export const skills: Skill[] = [
  { name: 'HTML', category: 'Core Skills' },
  { name: 'CSS', category: 'Core Skills' },
  { name: 'JavaScript', category: 'Core Skills' },
  { name: 'Python', category: 'Core Skills' },
  { name: 'CodePen', category: 'Tools & Technologies' },
  { name: 'Git/GitHub', category: 'Tools & Technologies' },
  { name: 'VS Code', category: 'Tools & Technologies' },
  { name: 'AI Concepts', category: 'Currently Exploring' },
  { name: 'Machine Learning', category: 'Currently Exploring' },
  { name: 'Advanced JavaScript', category: 'Currently Exploring' },
  { name: 'Software Development Concepts', category: 'Currently Exploring' },
];
