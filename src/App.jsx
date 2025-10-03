import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Music, Sparkles, Camera, Share2, Settings, PartyPopper, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import FlyingMoney from "./components/FlyingMoney";

// NOTE: This app is a single-file, production-ready React page for a flashy birthday surprise.
// ✨ Features
// - Hero with animated gradient text + floating hearts
// - Countdown to birthday
// - Fireworks + confetti burst on "Open Gift"
// - Typewriter love letter
// - Photo gallery (drag/scroll) with parallax
// - Music with visual pulse
// - Theme color picker & live customization (saved to localStorage)
// - Share button (Web Share API + clipboard fallback)
//
// 👉 How to use
// 1) Edit the defaults in DEFAULTS below (name, date, message, images, songUrl).
// 2) Press the gear icon (top-right) on the page to tweak live.
// 3) Click "Open Gift" to trigger the celebration 🎁
// 4) Deploy as a static site (Vercel/Netlify/GitHub Pages). No backend needed.

const DEFAULTS = {
  loverName: "Vợ Yêu",
  yourName: "Chồng yêu",
  birthdayISO: "2025-10-04T00:00:00+07:00",
  message:
    "Chúc mừng sinh nhật em yêu! Cảm ơn em đã đến và khiến thế giới của anh rực rỡ hơn. Mong mọi điều ngọt ngào nhất sẽ đến với em hôm nay và mỗi ngày sau này. Yêu em nhiều!",
  theme: "#ff4d6d",
  songUrl:
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/%C3%81nh+N%E1%BA%AFng+C%E1%BB%A7a+Anh+(From+%E2%80%9Cch%E1%BB%9D+Em+%C4%90%E1%BA%BFn+Ng%C3%A0y+Mai%E2%80%9D+Original+Motion+Picture+Soundtrack).mp3",
  images: [
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/467528904_1614473775862408_3048321606598975510_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/467553951_914922437025053_867282126130898544_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/484109688_1290459788736404_4129063281377405155_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/520400993_1422148472360362_1188874629437931651_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/528587762_2543726849313289_829480850707164437_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/532207868_1095892779175118_835755435937004913_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/536121760_1269010308340056_486265458167818805_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/542378545_1479001296473026_7360850152904275852_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/543806574_1243159804498251_7550476214201199272_n.jpg",
    "https://happy-birthday.s3.ap-northeast-1.amazonaws.com/546874181_798247915986236_6275110965284663135_n.jpg"
  ],
};

function useLocalState(key, initial) {
  const [v, setV] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch { }
  }, [key, v]);
  return [v, setV];
}

function useCountdown(targetISO) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = useMemo(() => new Date(targetISO), [targetISO]);
  const diff = Math.max(0, target - now);
  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return { days, hours, mins, secs, reached: diff === 0 };
}

function useThemeColor(hex) {
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", hex);
  }, [hex]);
}

function Fireworks({ fire }) {
  // Lightweight fireworks on a canvas
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const particles = [];
    function spawn(x, y) {
      for (let i = 0; i < 80; i++) {
        const angle = (Math.PI * 2 * i) / 80;
        const speed = 1.5 + Math.random() * 3;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 80 + Math.random() * 30,
          color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`,
        });
      }
    }

    let raf;
    function loop() {
      raf = requestAnimationFrame(loop);
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.life -= 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
    }
    loop();

    let clicker = null;
    if (fire) {
      clicker = () => spawn(Math.random() * width, Math.random() * height * 0.6 + height * 0.1);
      // periodic bursts
      const int = setInterval(clicker, 1200);
      return () => {
        window.removeEventListener("resize", resize);
        clearInterval(int);
        cancelAnimationFrame(raf);
      };
    }
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [fire]);
  return (
    <canvas
      ref={ref}
      className={`pointer-events-none fixed inset-0 z-10 mix-blend-screen ${fire ? "opacity-100" : "opacity-0"}`}
      style={{ transition: "opacity 600ms ease" }}
    />
  );
}

function FloatingHearts() {
  const hearts = new Array(18).fill(0);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "100vh", x: Math.random() * window.innerWidth, opacity: 0 }}
          animate={{ y: -200, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 16 + Math.random() * 8, repeat: Infinity, delay: i * 0.6 }}
          className="absolute"
        >
          <Heart className="w-6 h-6" style={{ color: `hsl(${(i * 37) % 360} 90% 60%)` }} />
        </motion.div>
      ))}
    </div>
  );
}

function Typewriter({ text, start, speed = 28 }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!start) return;
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      setOut((v) => v + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, start, speed]);
  return <p className="text-lg leading-8 whitespace-pre-wrap">{out}</p>;
}

function useConfetti() {
  const shoot = () => {
    // Try canvas-confetti if available
    const anyWin = window;
    if (anyWin.confetti) {
      anyWin.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => anyWin.confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } }), 300);
    } else {
      // fallback: tiny CSS burst
      const el = document.createElement("div");
      el.className = "fixed inset-0 pointer-events-none z-20";
      el.innerHTML = `<div class='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 confetti'></div>`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  };
  return shoot;
}

const QUESTIONS = [
  {
    q: "Anh ấn tượng gì về em nhất? 💕",
    a: ["Dễ thương", "Chiều cao", "Học giỏi"],
    correct: 1,
  },
  {
    q: "Món ăn anh thích nhất là gì? 🍲",
    a: ["Bánh mì", "Bún bò", "Mì Quảng"],
    correct: 0,
  },
];

export default function App() {
  const [config, setConfig] = useLocalState("bdx-config", DEFAULTS);
  const { days, hours, mins, secs } = useCountdown(config.birthdayISO);
  useThemeColor(config.theme);
  const [giftOpened, setGiftOpened] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const shoot = useConfetti();
  const [current, setCurrent] = useState(0);
  const [secondGiftOpened, setSecondGiftOpened] = useState(false);
  const [selectedCard, setSelectedCard] = useLocalState("selectedCard", null); // ✅ lưu vào localStorage
  const { reached } = useCountdown(config.birthdayISO);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showPreview, setShowPreview] = useState(true);
  const [shuffling, setShuffling] = useState(false);
  const [cards, setCards] = useState([1, 2, 3]);

  useEffect(() => {
    if (quizDone && score >= 2 && !selectedCard) {
      // Bước 1: show quà trong 2s
      setShowPreview(true);

      const previewTimer = setTimeout(() => {
        // Bước 2: bắt đầu shuffle
        setShowPreview(false);
        setShuffling(true);

        let count = 0;
        const interval = setInterval(() => {
          setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
          count++;
          if (count > 12) {
            clearInterval(interval);
            setShuffling(false);
          }
        }, 150); // shuffle nhanh hơn: 0.15s/lần
      }, 2000);

      return () => clearTimeout(previewTimer);
    }
  }, [quizDone, score, selectedCard]);


  useEffect(() => {
    if (config.images.length > 0) {
      const id = setInterval(() => {
        setCurrent((prev) => (prev + 1) % config.images.length);
      }, 3000); // đổi ảnh mỗi 2s
      return () => clearInterval(id);
    }
  }, [config.images.length]);

  useEffect(() => {
    if (musicOn && audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => { });
    }
  }, [musicOn, config.songUrl]);

  const primaryGlow = {
    boxShadow: `0 0 40px 8px ${config.theme}55, 0 0 120px 24px ${config.theme}33`,
  };

  const handleOpenGift = () => {
    // if (!reached) return;
    // if (giftOpened) return;
    setGiftOpened(true);
    // setMusicOn(true);
    shoot();
  };

  const share = async () => {
    const msg = `🎉 Happy Birthday ${config.loverName}!\nMade with love by ${config.yourName}.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Happy Birthday!", text: msg, url: window.location.href });
      } catch { }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Đã copy link vào clipboard 💖");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#0b0b12] via-[#0f0a1e] to-[#1a0b1a] text-white">
      <FloatingHearts />
      <Fireworks fire={giftOpened} />

      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 backdrop-blur-xl/30">
        <div className="flex items-center gap-2 select-none">
          <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <PartyPopper className="w-5 h-5" />
          </motion.div>
          <span className="font-semibold tracking-wide">Birthday Luxe</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={share} className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button size="icon" variant="secondary" onClick={() => setShowSettings((v) => !v)} aria-label="Settings">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-10 sm:pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl font-extrabold leading-tight"
            style={{ background: `linear-gradient(90deg, ${config.theme}, #ffd166, #a78bfa, ${config.theme})`, WebkitBackgroundClip: "text", color: "transparent" }}
          >
            Happy Birthday, {config.loverName}! 💖
          </motion.h1>
          <p className="mt-3 text-white/80">
            From {config.yourName} — dành tặng em một website chỉ riêng cho chúng mình.
          </p>

          {/* Countdown */}
          <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
            {[{ label: "Days", v: days }, { label: "Hours", v: hours }, { label: "Mins", v: mins }, { label: "Secs", v: secs }].map((t) => (
              <Card key={t.label} className="bg-white/5 border-white/10">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold" style={primaryGlow}>{String(t.v).padStart(2, "0")}</div>
                  <div className="text-xs sm:text-sm text-white/70 mt-1">{t.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gift Button */}
          {!giftOpened && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center h-screen fixed inset-0 bg-black/70 z-50"
            >
              <motion.div
                whileHover={reached ? { rotate: 5, scale: 1.05 } : {}}
                whileTap={reached ? { scale: 0.95 } : {}}
                onClick={handleOpenGift}
                className={`cursor-pointer text-[200px] ${reached ? "text-pink-400" : "text-gray-500 opacity-50 cursor-not-allowed"
                  }`}
              >
                🎁
              </motion.div>
              {!reached && (
                <p className="absolute mt-64 text-white/70">
                  ⏳ Đợi tới sinh nhật mới mở được nha!
                </p>
              )}
            </motion.div>
          )}

          {giftOpened && (
            <div className="mt-6 text-center max-w-2xl mx-auto">
              <Typewriter text={`
              Trái tim này trao đến em
              Từng ngày bên nhau thật êm đềm
              Chúc em hạnh phúc, mãi dịu êm
              Anh yêu em đến trọn đời này ❤️`}
                start={giftOpened} />
            </div>
          )}

          {/* Music */}
          <div className="mt-4 inline-flex items-center gap-3 text-white/80">
            <Music className={`w-5 h-5 ${musicOn ? "animate-pulse" : "opacity-50"}`} />
            <Switch checked={musicOn} onCheckedChange={setMusicOn} />
            <span>Nhạc nền {musicOn ? "BẬT" : "TẮT"}</span>
            <audio ref={audioRef} src={config.songUrl} loop />
          </div>
        </div>
      </section>

      {/* Love Letter */}
      <section className="px-4 sm:px-6 pb-12">
        <Card className="mx-auto max-w-3xl bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Lời nhắn dành riêng cho {config.loverName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {giftOpened ? (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Typewriter text={config.message} start={giftOpened} />
                </motion.div>
              ) : (
                <motion.p key="placeholder" className="text-white/60">
                  Ấn “Mở quà bất ngờ” để xem lời chúc ✨
                </motion.p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </section>

      {/* Gallery */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-4 opacity-90">
            <Camera className="w-5 h-5" />
            <h3 className="text-xl font-semibold">Kỷ niệm của chúng mình</h3>
          </div>
          <div className="relative h-screen w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center bg-black/20">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={config.images[current]}
                className="max-h-full max-w-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Timeline / Date */}
      <section className="px-4 sm:px-6 pb-24">
        <Card className="mx-auto max-w-3xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-white/90">
              <CalendarDays className="w-5 h-5" />
              <div>
                <div className="text-sm">Sinh nhật của {config.loverName}</div>
                <div className="text-xl font-bold" style={primaryGlow}>
                  {new Date(config.birthdayISO).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Settings Drawer */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-md bg-black/60 backdrop-blur-xl border-l border-white/10 p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tùy chỉnh</h3>
              <Button variant="secondary" onClick={() => setShowSettings(false)}>Đóng</Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm opacity-80">Tên người yêu</label>
                <Input value={config.loverName} onChange={(e) => setConfig({ ...config, loverName: e.target.value })} />
              </div>
              <div>
                <label className="text-sm opacity-80">Tên của bạn</label>
                <Input value={config.yourName} onChange={(e) => setConfig({ ...config, yourName: e.target.value })} />
              </div>
              <div>
                <label className="text-sm opacity-80">Ngày giờ sinh nhật (ISO)</label>
                <Input
                  placeholder="YYYY-MM-DDTHH:mm:ss"
                  value={config.birthdayISO}
                  onChange={(e) => setConfig({ ...config, birthdayISO: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm opacity-80">Màu chủ đạo (#hex)</label>
                <Input value={config.theme} onChange={(e) => setConfig({ ...config, theme: e.target.value })} />
              </div>
              <div>
                <label className="text-sm opacity-80">Link nhạc nền (mp3)</label>
                <Input value={config.songUrl} onChange={(e) => setConfig({ ...config, songUrl: e.target.value })} />
              </div>
              <div>
                <label className="text-sm opacity-80">Lời nhắn</label>
                <Textarea rows={5} value={config.message} onChange={(e) => setConfig({ ...config, message: e.target.value })} />
              </div>
              <div>
                <label className="text-sm opacity-80">Ảnh kỷ niệm (mỗi link 1 dòng)</label>
                <Textarea
                  rows={6}
                  value={config.images.join("\n")}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      images: e.target.value.split("\n"), // KHÔNG filter(Boolean)
                    })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-white/60 mt-6">Mọi thay đổi sẽ được lưu vào trình duyệt (localStorage).</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Khi mở hộp quà nhưng chưa làm quiz */}
      {secondGiftOpened && !quizStarted && !quizDone && (
        <div className="text-center my-10">
          <p className="mb-4 text-xl">Trước khi mở quà, trả lời vài câu hỏi đã nhé 😘</p>
          <Button onClick={() => setQuizStarted(true)}>Bắt đầu Quiz</Button>
        </div>
      )}

      {/* Quiz */}
      {quizStarted && !quizDone && (
        <div className="space-y-6 max-w-lg mx-auto my-10">
          {QUESTIONS.map((q, i) => (
            <div key={i} className="p-4 bg-white/10 rounded-xl">
              <p className="mb-2">{q.q}</p>
              <div className="flex gap-3 flex-wrap">
                {q.a.map((ans, idx) => {
                  const chosen = answers?.[i]; // state lưu câu đã chọn
                  const isCorrect = q.correct === idx;
                  return (
                    <Button
                      key={idx}
                      onClick={() => {
                        if (chosen !== undefined) return; // đã chọn rồi thì thôi
                        if (idx === q.correct) setScore((s) => s + 1);
                        setAnswers((prev) => ({ ...prev, [i]: idx }));

                        // nếu là câu cuối cùng thì kết thúc quiz
                        if (i === QUESTIONS.length - 1) {
                          setQuizDone(true);
                        }
                      }}
                      disabled={chosen !== undefined}
                      className={
                        chosen === idx
                          ? isCorrect
                            ? "bg-green-600"
                            : "bg-red-600"
                          : ""
                      }
                    >
                      {ans}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {quizDone && score < 2 && (
        <div className="text-center my-10 text-xl">
          😅 Em chỉ đúng {score}/{QUESTIONS.length} thôi… thử lại nhé!
          <div className="mt-4">
            <Button
              onClick={() => {
                setQuizStarted(false);
                setQuizDone(false);
                setScore(0);
                setAnswers({});
              }}
            >
              Làm lại
            </Button>
          </div>
        </div>
      )}

      {/* --- Hộp quà thứ 2 ở cuối trang --- */}
      {!quizDone && !selectedCard && (
        <div className="my-20 flex justify-center">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSecondGiftOpened(true)}
            className="cursor-pointer text-[150px] text-yellow-400"
          >
            🎁
          </motion.div>
        </div>
      )}

      {/* Khi mở hộp quà 2 → hiện 3 thẻ (chỉ khi quizDone & score đủ) */}
      {quizDone && score >= 2 && !selectedCard && (
        <div className="flex justify-center gap-6 my-20">
          {cards.map((num) => (
            <motion.div
              key={num}
              layout   // 👈 rất quan trọng để AnimatePresence + layout animation hoạt động
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              whileHover={!shuffling && !showPreview ? { scale: 1.1 } : {}}
              whileTap={!shuffling && !showPreview ? { scale: 0.95 } : {}}
              onClick={() => {
                if (!shuffling && !showPreview) setSelectedCard(num);
              }}
              className="w-40 h-60 rounded-xl overflow-hidden shadow-lg cursor-pointer flex items-center justify-center text-2xl font-bold bg-pink-500 text-white"
            >
              {showPreview ? (
                <div className="flex flex-col items-center justify-center w-full h-full p-3 text-center">
                  {num === 1 && (
                    <>
                      <span className="text-5xl mb-3">💍</span>
                      <span className="text-lg font-semibold">iPhone 16</span>
                    </>
                  )}
                  {num === 2 && (
                    <>
                      <span className="text-5xl mb-3">💳</span>
                      <span className="text-lg font-semibold">Voucher buffet ốc</span>
                      <span className="text-lg font-semibold">1 năm</span>
                    </>
                  )}
                  {num === 3 && (
                    <>
                      <span className="text-5xl mb-3">💸</span>
                      <span className="text-lg font-semibold">Voucher mua sắm</span>
                      <span className="text-lg font-semibold">5 triệu</span>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(https://happy-birthday.s3.ap-northeast-1.amazonaws.com/542378545_1479001296473026_7360850152904275852_n.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Nội dung các thẻ */}
      {selectedCard === 1 && (
        <div className="mb-20 text-center text-3xl font-bold text-pink-400">
          💍 Iphone 16 ❤️
        </div>
      )}

      {selectedCard === 2 && (
        <div className="mb-20 text-center text-3xl font-bold text-pink-400">
          💍 Voucher buffer ốc 1 năm ❤️
        </div>
      )}

      {selectedCard === 3 && (
        <div className="text-center">
          <FlyingMoney show={true} />
          <p className="mb-20 text-2xl font-bold mt-4">
            Voucher mua sắm trị giá 5 triệu ❤️
            <br />
            💸 Em là kho báu lớn nhất của anh! Đây thêm tiền tiêu nè 😘
          </p>
        </div>
      )}

      <style>{`
        :root { --accent: ${DEFAULTS.theme}; }
        .hide-scrollbar::-webkit-scrollbar{ display:none; }
        .hide-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
        .confetti { width: 6px; height: 6px; position: relative; }
        .confetti::before { content: ""; position: absolute; inset: -120px -120px; background:
          radial-gradient(circle at 10% 20%, #fff 0 3px, transparent 3px),
          radial-gradient(circle at 30% 60%, var(--accent) 0 4px, transparent 4px),
          radial-gradient(circle at 80% 30%, #ffd166 0 3px, transparent 3px),
          radial-gradient(circle at 60% 80%, #a78bfa 0 4px, transparent 4px);
          background-size: 40px 40px; animation: burst 0.9s ease forwards; }
        @keyframes burst { from { transform: scale(0.2) rotate(0deg); opacity: 0.9 } to { transform: scale(1.6) rotate(40deg); opacity: 0 } }
      `}</style>

      <footer className="pb-10 text-center text-xs text-white/50">Made with ❤️ by {config.yourName}</footer>
    </div>
  );
}
