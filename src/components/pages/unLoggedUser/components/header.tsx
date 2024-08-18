import { ModeToggle } from "@/components/theme/mode-toggle";

export function Header() {
  return (
    <section className="relative text-center mb-12">
        <div className='flex justify-center'>
            <h2 className="text-4xl font-bold mb-4">Master English with LearnJoy</h2>
        </div>
        <p className="text-2xl text-muted-foreground">Interactive lessons, games, and personalized learning for students and teachers.</p>
        <div className="absolute right-0 top-0">
            <ModeToggle />
        </div>
    </section>
  )
}