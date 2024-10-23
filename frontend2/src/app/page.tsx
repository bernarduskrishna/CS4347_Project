"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import * as React from 'react';

import ABCMusicPreview from './components/preview';
import Navbar from './components/navbar';

import "./styles/globals.css";
import GithubIcon from './assets/github.svg'

export default function Home() {

  const DEFAULT_ABC = `
  \`\`\`abc
  X: 1
  M: 4/4
  K: C
  V:1                             clef=treble staff=1
  C3 D E3 C | E2 C2E4     |
  V:2                             clef=bass staff=1
  [C,E,G,]8 |[C,E,G,]8    |
  \`\`\``;
  const [displayMusicABC, setDisplayMusicABC] = React.useState(DEFAULT_ABC);

  return (
    <>
        <Navbar setDisplayMusicABC={setDisplayMusicABC}/>
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <ABCMusicPreview abcString={displayMusicABC} />
            </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/bernarduskrishna/CS4347_Project"
            target="_blank"
            rel="noopener noreferrer"
            >
            <Image
                aria-hidden
                src={GithubIcon}
                alt="GitHub icon"
                width={16}
                height={16}
            />
            Visit our GitHub Repository →
            </a>
        </footer>
        </div>
    </>
  );
}
