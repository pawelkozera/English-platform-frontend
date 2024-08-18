import { BookOpen, GamepadIcon, TestTube, PlusCircle, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function InformationCards() {
  return (
    <section className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
        <CardHeader>
            <CardTitle>For Students</CardTitle>
            <CardDescription>Enhance your English skills</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2">
            <li className="flex items-center"><BookOpen className="mr-2" /> Interactive Lessons</li>
            <li className="flex items-center"><GamepadIcon className="mr-2" /> Language Games</li>
            <li className="flex items-center"><TestTube className="mr-2" /> Progress Tests</li>
            </ul>
        </CardContent>
        </Card>
        <Card>
        <CardHeader>
            <CardTitle>For Teachers</CardTitle>
            <CardDescription>Empower your teaching</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2">
            <li className="flex items-center"><PlusCircle className="mr-2" /> Create Lessons</li>
            <li className="flex items-center"><FileText className="mr-2" /> Design Tests</li>
            <li className="flex items-center"><Settings className="mr-2" /> Customize Games</li>
            </ul>
        </CardContent>
        </Card>
    </section>
  )
}