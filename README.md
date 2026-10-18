# Pathwise

### Engineering admissions, made clearer.

Pathwise is an AI-enabled family decision-support prototype that helps students and parents explore engineering-college options together. It turns academic details, entrance-exam results, family priorities, and affordability into a shortlist that is easier to discuss.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs) ![React](https://img.shields.io/badge/React-19-149eca?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)

## What it does

- **Supports both students and parents** with a guided admissions-planning flow.
- **Builds an academic profile** from Class 10/12 details and AP/Telangana EAPCET, JEE Main, and JEE Advanced results.
- **Personalizes a college shortlist** using rank, region, category, preferences, and family priorities.
- **Makes trade-offs visible** with dream/realistic/safe groupings, estimated fees, placement indicators, and adjustable recommendation weights.
- **Helps families compare options** with an indicative cost-versus-earnings view.

## Preview

Start the app locally to explore the student and parent flows and generate a personalized shortlist.

## Run locally

Requires Node.js 20 or later and npm.

```bash
git clone https://github.com/susyanthkumar/AI-INTREGRATED-FOR-EDUCATION.git
cd AI-INTREGRATED-FOR-EDUCATION
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## How recommendations work

This repository currently contains a **front-end prototype**. College data and cutoffs are illustrative, and recommendation scores are calculated in the browser from the sample dataset and the preferences entered. There is no live counselling database or connected AI service in this version.

Treat every admission chance, cutoff, fee, and placement figure as an estimate for demonstration. Confirm current-year information, eligibility, and seat rules with official counselling authorities and colleges before making decisions.

## Built with

- [Next.js](https://nextjs.org/) App Router
- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/) icons

## Contributing

Issues and pull requests are welcome. Please describe the change and include screenshots for visual updates.
