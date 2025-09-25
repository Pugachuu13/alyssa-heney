"use client";

import { useEffect, useRef, useState } from "react";

type Task = {
  id: string;
  text: string;
  checked: boolean;
};

type RoomChecklist = {
  name: string;
  icon: string;
  tasks: Task[];
};

const ROOM_DETAILS: Array<{ name: string; icon: string }> = [
  { name: "Living Room", icon: "🛋️" },
  { name: "Kitchen", icon: "🍓" },
  { name: "Bathroom", icon: "🫧" },
  { name: "Bedroom", icon: "🌙" },
  { name: "Dining Room", icon: "🍰" },
  { name: "Entrance", icon: "🎀" },
  { name: "Extra", icon: "💖" },
];

const ROOM_SUGGESTIONS: Record<string, string[]> = {
  "Living Room": [
    "Fluff pillows",
    "Dust TV console",
    "Vacuum comfy rug",
    "Wipe coffee table",
    "Tidy blankets basket",
  ],
  Kitchen: [
    "Shine countertops",
    "Load dishwasher",
    "Wipe fridge handles",
    "Sweep crumbs",
    "Sanitize sink",
  ],
  Bathroom: [
    "Scrub sink",
    "Polish mirror",
    "Refresh towels",
    "Shine faucets",
    "Replace bath mat",
  ],
  Bedroom: [
    "Make the bed",
    "Fold clothes",
    "Dust nightstand",
    "Water plants",
    "Spritz linen spray",
  ],
  "Dining Room": [
    "Polish table",
    "Set centerpiece",
    "Dust chairs",
    "Sweep floor",
    "Wipe placemats",
  ],
  Entrance: [
    "Tidy shoe rack",
    "Shake doormat",
    "Wipe door knobs",
    "Organize mail",
    "Spray room mist",
  ],
  Extra: [
    "Light favorite candle",
    "Refill diffuser",
    "Water succulents",
    "Reset cozy corner",
    "Play happy playlist",
  ],
};

const createTask = (): Task => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  text: "",
  checked: false,
});

const createRoomData = (): RoomChecklist[] =>
  ROOM_DETAILS.map(({ name, icon }) => ({
    name,
    icon,
    tasks: Array.from({ length: 4 }, createTask),
  }));

export default function Home() {
  const [rooms, setRooms] = useState<RoomChecklist[]>(createRoomData);
  const [activeSuggestion, setActiveSuggestion] = useState<{
    roomName: string;
    taskId: string;
  } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("Great job! 💫");
  const celebrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const previousCompletedRef = useRef(0);

  const handleToggle = (roomName: string, taskId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.name === roomName
          ? {
              ...room,
              tasks: room.tasks.map((task) =>
                task.id === taskId ? { ...task, checked: !task.checked } : task
              ),
            }
          : room
      )
    );
  };

  const handleTextChange = (roomName: string, taskId: string, text: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.name === roomName
          ? {
              ...room,
              tasks: room.tasks.map((task) =>
                task.id === taskId ? { ...task, text } : task
              ),
            }
          : room
      )
    );
  };

  const handleAddTask = (roomName: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.name === roomName
          ? {
              ...room,
              tasks: [...room.tasks, createTask()],
            }
          : room
      )
    );
  };

  const totalTasks = rooms.reduce((count, room) => count + room.tasks.length, 0);
  const completedTasks = rooms.reduce(
    (count, room) => count + room.tasks.filter((task) => task.checked).length,
    0
  );
  const completionPercent = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  useEffect(() => {
    const previous = previousCompletedRef.current;
    if (completedTasks > previous) {
      const difference = completedTasks - previous;
      if (completedTasks === totalTasks && totalTasks > 0) {
        setCelebrationMessage("Everything sparkles! ✨");
        setShowCelebration(true);
      } else if (completedTasks % 5 === 0 || difference >= 3) {
        setCelebrationMessage("You’re on a roll! 🎉");
        setShowCelebration(true);
      }
    }

    previousCompletedRef.current = completedTasks;
  }, [completedTasks, totalTasks]);

  useEffect(() => {
    if (showCelebration) {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
      celebrationTimeoutRef.current = setTimeout(() => {
        setShowCelebration(false);
      }, 2400);
    }

    return () => {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
    };
  }, [showCelebration]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-100 to-rose-200 text-rose-900">
      {showCelebration && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-white/10 to-rose-200/30 backdrop-blur-sm" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative h-32 w-32">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
                ✨
              </span>
              <span className="absolute left-1/2 top-2 -translate-x-1/2 animate-ping text-4xl text-pink-300">
                🎆
              </span>
              <span className="absolute left-2 top-1/3 animate-bounce text-3xl text-rose-400">
                💥
              </span>
              <span className="absolute right-2 top-1/3 animate-bounce text-3xl text-rose-400 delay-150">
                💥
              </span>
            </div>
            <p className="rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-rose-600 shadow">
              {celebrationMessage}
            </p>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-20 h-56 w-56 rounded-full bg-rose-300/40 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-200/20 blur-3xl" />
      </div>
      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center gap-10 px-6 py-12 sm:px-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="text-5xl">💗</span>
          <h1 className="text-4xl font-bold text-rose-700 drop-shadow-sm sm:text-5xl">
            Daily Cleaning List
          </h1>
          <p className="max-w-2xl text-lg text-rose-600">
            Tidy up every corner with sparkles, smiles, and super cute vibes! Check
            off your chores and write down what to do next to keep your space cozy
            and bright.
          </p>
          <div className="mt-2 w-full max-w-xl rounded-full bg-white/60 p-1 shadow-inner shadow-pink-200/70">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${Math.min(completionPercent, 100)}%` }}
            />
            <div className="mt-2 text-sm font-semibold text-rose-500">
              {completedTasks} of {totalTasks} tasks sparkling ({completionPercent}% cute progress)
            </div>
          </div>
        </header>

        <section className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.name}
              className="group relative overflow-hidden rounded-3xl border border-pink-200 bg-white/80 p-6 shadow-[0_22px_50px_-30px_rgba(219,39,119,0.65)] backdrop-blur transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgba(190,24,93,0.55)]"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100 opacity-90 blur-2xl transition duration-500 group-hover:scale-110" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-rose-700">
                    {room.name}
                  </h2>
                  <p className="text-sm text-rose-400">Make it sparkle!</p>
                </div>
                <span className="text-3xl" aria-hidden>
                  {room.icon}
                </span>
              </div>

              <ul className="relative mt-5 space-y-3">
                {room.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex flex-col gap-2 rounded-2xl bg-rose-50/80 px-3 py-2 shadow-inner shadow-pink-200/60"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        aria-label={`Mark ${room.name} task as done`}
                        type="checkbox"
                        checked={task.checked}
                        onChange={() => handleToggle(room.name, task.id)}
                        className="h-5 w-5 rounded border-2 border-rose-200 bg-white accent-pink-400 transition focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
                      />
                      <input
                        aria-label={`${room.name} task description`}
                        type="text"
                        value={task.text}
                        placeholder="Type a cute chore..."
                        onFocus={() =>
                          setActiveSuggestion({ roomName: room.name, taskId: task.id })
                        }
                        onBlur={() => {
                          setTimeout(() => {
                            setActiveSuggestion((current) =>
                              current?.roomName === room.name && current?.taskId === task.id
                                ? null
                                : current
                            );
                          }, 120);
                        }}
                        onChange={(event) =>
                          handleTextChange(room.name, task.id, event.target.value)
                        }
                        className="flex-1 rounded-2xl border border-transparent bg-transparent px-2 py-1 text-sm text-rose-700 placeholder:text-rose-300 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                      />
                    </div>
                    {activeSuggestion?.roomName === room.name &&
                      activeSuggestion?.taskId === task.id && (
                        <div className="flex flex-wrap gap-2">
                          {(ROOM_SUGGESTIONS[room.name] || [])
                            .filter((suggestion) =>
                              suggestion
                                .toLowerCase()
                                .includes(task.text.toLowerCase())
                            )
                            .slice(0, 4)
                            .map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  handleTextChange(room.name, task.id, suggestion);
                                  setActiveSuggestion(null);
                                }}
                                className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-rose-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-100"
                              >
                                {suggestion}
                              </button>
                            ))}
                          {(ROOM_SUGGESTIONS[room.name] || [])
                            .filter((suggestion) =>
                              suggestion
                                .toLowerCase()
                                .includes(task.text.toLowerCase())
                            ).length === 0 && (
                            <span className="text-xs italic text-rose-300">
                              Keep typing your custom sparkle!
                            </span>
                          )}
                        </div>
                      )}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleAddTask(room.name)}
                className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
              >
                <span aria-hidden>➕</span>
                Add task
              </button>
            </div>
          ))}
        </section>

        <footer className="text-center text-sm text-rose-500">
          Made with love, sparkles, and a dash of motivation 💖
        </footer>
      </main>
    </div>
  );
}
