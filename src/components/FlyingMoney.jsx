import { motion } from "framer-motion";

export function FlyingMoney({ show }) {
    const bills = new Array(15).fill(0);
    return (
        <div className="pointer-events-none fixed inset-0 z-40">
            {show &&
                bills.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
                        animate={{ y: -200, opacity: [1, 1, 0] }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                        }}
                        className="absolute text-3xl"
                    >
                        💵
                    </motion.div>
                ))}
        </div>
    );
}

export default FlyingMoney;