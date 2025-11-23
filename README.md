📘 Company Research Assistant (Account Plan Generator)

An AI-powered conversational agent that helps users research companies through natural conversation and automatically generates structured, editable Account Plans.
Designed to showcase conversational intelligence, agentic behaviour, multi-source research synthesis, and adaptive UX across different user personas.


Overview

This project is built as a part of the Conversational AI Assignment, fulfilling the problem statement:

1. Company Research Assistant (Account Plan Generator)

The agent can:

 Gather information about companies from multiple sources

 Synthesize findings into a clean, structured account plan

 Provide updates when it encounters conflicting data

 Allow the user to update or regenerate only selected sections

 Support chat and voice interaction modes

 Include Dark/Light theme toggle for enhanced UX

 Adapt to different user personas (Confused, Efficient, Chatty, Edge Case)

 Key Features
 Multi-Source Company Research

Pulls data about a company (overview, history, tech stack, culture, challenges, risks).

Synthesizes cross-source information into clean insights.

Works even with partial or ambiguous user input.

 Conflict Detection & Human-in-the-Loop Updates

The bot notifies the user when sources disagree:

“I’m finding conflicting information about Acme Corp’s revenue. Should I dig deeper?”

This demonstrates agentic reasoning and transparency.

 Structured Account Plan Generator

Automatically generates sections such as:

Company Overview

Strategic Initiatives

Key Challenges

Stakeholders

SWOT

Tech Stack

Opportunities

Risks

Next Steps

 Section-Level Editing

Users may update ANY section individually:

“Update only the Risks section to include budget freeze and increased competition.”

 Chat Mode + Voice Mode

ChatGPT-style chat interface

Optional voice integration (STT/TTS)

Natural conversational flow

Theme Switcher (Dark ↔ Light)

Small UI button allows switching between themes with smooth transitions.

Adaptive Behaviour

Bot handles:

Confused users

Goal-oriented efficient users

Chatty/off-topic users

Edge cases (invalid inputs, impossible requests, fictional companies)
🏛️ Architecture
Frontend (React, Dark/Light UI)
│
├── Chat Interface
├── Voice Mode (optional)
├── Company Dropdown Selector
├── Account Plan Renderer
└── Theme Toggle
        │
        ▼
Backend / AI Orchestrator
│
├── Natural Language Understanding
├── Multi-source Research Aggregator
├── Conflict Detection Engine
├── Account Plan Generator (LLM)
└── Section Update Manager
        │
        ▼
External Sources
- Web Search
- Company Info APIs
- News Data
- User-provided documents

🛠️ Tech Stack
Frontend

React

HTML/CSS/JavaScript

Dark/Light theme using CSS variables

Voice mode via Web Speech API (optional)

Backend / AI

Node.js

Gemini / LLM APIs

Custom reasoning prompts

Section update logic

Conflict detection logic

Storage

JSON-based plan store (local/state)

DB integration
