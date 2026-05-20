import React from 'react';

export const InfoPanel: React.FC = () => {
  return (
    <div className="w-full lg:w-96 flex flex-col gap-6 text-sm text-zinc-400 h-full overflow-y-auto custom-scrollbar">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-zinc-100 font-bold mb-4 text-lg">How it Works</h3>
        
        <div className="space-y-6">
          <section>
            <h4 className="text-indigo-400 font-semibold mb-2">1. Loading & Logic</h4>
            <p className="leading-relaxed">
              We use a standard HTML5 <code>&lt;canvas&gt;</code> inside a React component. 
              The <code>drawImage()</code> method is the core engine, allowing us to take the single sprite sheet image and "draw" only a tiny rectangular portion of it at a time.
            </p>
          </section>

          <section>
            <h4 className="text-indigo-400 font-semibold mb-2">2. Cropping Logic</h4>
            <p className="leading-relaxed mb-2">
              To animate, we calculate a window (x, y, width, height) on the source image:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-500">
              <li><strong className="text-zinc-300">Row (Y):</strong> Determined by direction (0=Up, 1=Right, 2=Down, 3=Left).</li>
              <li><strong className="text-zinc-300">Col (X):</strong> Determined by the animation frame timer. Loops 0 → 3.</li>
            </ul>
            <div className="bg-zinc-950 p-3 rounded mt-2 font-mono text-xs border border-zinc-800">
              sx = frameIndex * (imgWidth / 4)<br/>
              sy = direction * (imgHeight / 4)
            </div>
          </section>

          <section>
            <h4 className="text-indigo-400 font-semibold mb-2">3. Animation Loop</h4>
            <p className="leading-relaxed">
              We use <code>requestAnimationFrame</code> for smooth 60fps rendering. However, we update the sprite frame only every 8 ticks to ensure the character doesn't "run" too frantically. When movement stops, we force the frame index to 0 (Idle).
            </p>
          </section>

           <section>
            <h4 className="text-indigo-400 font-semibold mb-2">4. Changing Assets</h4>
            <p className="leading-relaxed">
              This code is dynamic. As long as you upload a sprite sheet with 4 rows and 4 columns, the math automatically adjusts to the image dimensions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
