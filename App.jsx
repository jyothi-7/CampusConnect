import { useEffect, useMemo, useRef, useState } from 'react';
import { authenticateStudent, clearAuthSession, getAuthSession, storeAuthSession } from './auth.js';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen, Bus, CalendarDays,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Compass, DoorOpen, FileText,
  Filter, GraduationCap, HeartPulse, Home, LifeBuoy, MapPin, Menu, MessageSquareText,
  Navigation, Plus, Search, Shield, ShieldAlert, Sparkles, Users, X,
} from 'lucide-react';

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }, [key, value]);

  return [value, setValue];
}

const faculty = [
  { name: 'Dr. Ananya Rao', role: 'Assistant Professor', dept: 'Computer Science', room: 'CSE-204', subjects: 'Data Structures, Python', hours: 'Mon–Fri · 10:00 AM–1:00 PM', image: 'photo-1551836022-d5d88e9218df' },
  { name: 'Prof. Kiran Kumar', role: 'Associate Professor', dept: 'Electronics', room: 'ECE-312', subjects: 'Digital Systems, IoT', hours: 'Mon, Wed, Fri · 2:00–4:00 PM', image: 'photo-1560250097-0b93528c311a' },
  { name: 'Dr. Meera Nair', role: 'Professor & HOD', dept: 'Computer Science', room: 'CSE-101', subjects: 'Machine Learning, AI', hours: 'Tue–Thu · 11:00 AM–1:00 PM', image: 'photo-1580489944761-15a19d654956' },
  { name: 'Prof. Arjun Menon', role: 'Assistant Professor', dept: 'Mechanical', room: 'ME-208', subjects: 'Thermodynamics, CAD', hours: 'Mon–Fri · 9:30–11:00 AM', image: 'photo-1500648767791-00dcc994a43e' },
];
const facultyProfiles = {
  'Dr. Ananya Rao': { email: 'ananya.rao@northfield.edu', qualifications: 'Ph.D. in Computer Science, IISc Bengaluru; M.Tech. in Computer Science, NIT Surathkal', expertise: 'Data structures, programming languages, and computing education', bio: 'Dr. Rao works with students to build strong foundations in software design and problem solving. Her teaching combines careful theory with small, practical coding projects.', notes: 'Office-hour questions are welcome. Bring your current code or a specific concept you would like to discuss.', courses: 'Data Structures, Python Programming, Object-Oriented Design', office: 'CSE Block · Room 204', freeHours: 'Mon–Fri · 10:00 AM–1:00 PM' },
  'Prof. Kiran Kumar': { email: 'kiran.kumar@northfield.edu', qualifications: 'M.S. in Embedded Systems, University of Waterloo; B.E. in Electronics, PES University', expertise: 'Digital systems, embedded computing, and Internet of Things', bio: 'Prof. Kumar helps students connect electronics fundamentals with working prototypes, with a focus on reliable and energy-aware devices.', notes: 'For lab consultations, please email ahead with your project topic.', courses: 'Digital System Design, IoT Applications, Microcontrollers', office: 'ECE Block · Room 312', freeHours: 'Mon, Wed, Fri · 2:00–4:00 PM' },
  'Dr. Meera Nair': { email: 'meera.nair@northfield.edu', qualifications: 'Ph.D. in Artificial Intelligence, University of Edinburgh; M.Tech. in Computer Science, IIT Madras', expertise: 'Machine learning, responsible AI, and applied data science', bio: 'Dr. Nair leads the Computer Science department and mentors student research on practical, human-centered machine learning.', notes: 'Students interested in research can send a short note about their question and relevant coursework.', courses: 'Machine Learning, Artificial Intelligence, Data Mining', office: 'CSE Block · Room 101', freeHours: 'Tue–Thu · 11:00 AM–1:00 PM' },
  'Prof. Arjun Menon': { email: 'arjun.menon@northfield.edu', qualifications: 'M.Tech. in Thermal Engineering, IIT Bombay; B.E. in Mechanical Engineering, BMSCE', expertise: 'Thermodynamics, computer-aided design, and sustainable product engineering', bio: 'Prof. Menon teaches core mechanical engineering and supports student teams moving from CAD concepts to manufacturable prototypes.', notes: 'Bring drawings or a CAD file for design feedback during office hours.', courses: 'Engineering Thermodynamics, CAD, Product Design Studio', office: 'Mechanical Block · Room 208', freeHours: 'Mon–Fri · 9:30–11:00 AM' },
};
const facultyNotes = {
  'Dr. Ananya Rao': [
    { title: 'Trees and Binary Search Trees', chapter: 'Trees and Binary Search Trees', subject: 'Data Structures', description: 'A structured guide to tree terminology, traversals, binary search trees, and common operations.', fileType: 'PDF', fileName: 'ananya-rao-data-structures-trees.pdf', uploadedAt: '28 Sep 2026', fileSize: '1.8 MB', content: 'Trees and Binary Search Trees\n\nA tree is a hierarchical data structure made of nodes connected by edges. A binary search tree maintains the ordering rule: values smaller than a node appear in its left subtree, and larger values appear in its right subtree.\n\nKey traversals\n• Inorder: left, root, right. Produces sorted output for a BST.\n• Preorder: root, left, right. Useful for copying a tree.\n• Postorder: left, right, root. Useful for deletion.\n\nRemember to consider the height of the tree when analysing search, insertion, and deletion.' },
    { title: 'Functions and Modules', chapter: 'Functions and Modules', subject: 'Python', description: 'Examples for defining reusable functions, composing modules, and writing clear interfaces.', fileType: 'PPTX', fileName: 'ananya-rao-python-functions.pptx', uploadedAt: '25 Sep 2026', fileSize: '2.4 MB', content: 'Functions and Modules\n\nA function packages a reusable operation behind a meaningful name. Prefer small functions with clear parameters and one responsibility.\n\nPython reminders\n• Use def to declare a function.\n• Return values explicitly when a caller needs a result.\n• Keep related functions in modules and import them where needed.\n\nPractice: write a function that validates input, transforms it, and returns a useful result without changing global state.' },
  ],
  'Prof. Kiran Kumar': [
    { title: 'Digital Logic Design', chapter: 'Combinational Circuits', subject: 'Digital Systems', description: 'Revision notes on Boolean expressions, logic gates, and combinational circuit design.', fileType: 'PDF', fileName: 'kiran-kumar-digital-logic.pdf', uploadedAt: '27 Sep 2026', fileSize: '1.5 MB', content: 'Digital Logic Design\n\nCombinational circuits produce outputs determined only by their current inputs. Begin with a truth table, derive a Boolean expression, and simplify it using Boolean algebra or Karnaugh maps.\n\nImportant gates\n• AND requires every input to be 1.\n• OR requires at least one input to be 1.\n• NOT inverts the input.\n\nAlways verify a simplified expression against the original truth table.' },
    { title: 'IoT Sensor Networks', chapter: 'Connected Devices', subject: 'IoT', description: 'A practical overview of sensor nodes, communication layers, and reliable data collection.', fileType: 'DOCX', fileName: 'kiran-kumar-iot-sensor-networks.docx', uploadedAt: '22 Sep 2026', fileSize: '920 KB', content: 'IoT Sensor Networks\n\nAn IoT system connects sensing, communication, processing, and action. A sensor node should be designed with power, connectivity, sampling frequency, and data integrity in mind.\n\nWhen designing a network, define the measurement first, then select an appropriate protocol and gateway. Include retry behaviour and clear handling for missing or noisy readings.' },
  ],
  'Dr. Meera Nair': [
    { title: 'Supervised Learning Foundations', chapter: 'Regression and Classification', subject: 'Machine Learning', description: 'A conceptual guide to labelled data, model fitting, evaluation, and avoiding data leakage.', fileType: 'PDF', fileName: 'meera-nair-supervised-learning.pdf', uploadedAt: '29 Sep 2026', fileSize: '2.1 MB', content: 'Supervised Learning Foundations\n\nSupervised learning learns a mapping from input features to a labelled target. Regression predicts continuous values; classification predicts categories.\n\nSplit data into training and evaluation sets before fitting the model. Use metrics that reflect the problem, and inspect errors rather than relying on a single score. Data leakage can make an apparently strong model fail in real use.' },
    { title: 'Responsible AI Checklist', chapter: 'Human-Centred AI', subject: 'Artificial Intelligence', description: 'Questions for checking fairness, transparency, privacy, and accountability throughout an AI project.', fileType: 'PPTX', fileName: 'meera-nair-responsible-ai.pptx', uploadedAt: '24 Sep 2026', fileSize: '1.7 MB', content: 'Responsible AI Checklist\n\nBefore deployment, ask:\n• Who benefits from this system and who may be excluded?\n• Is the training data relevant, consented, and representative?\n• Can a user understand and challenge an important decision?\n• Are privacy, security, and monitoring responsibilities assigned?\n\nResponsible AI is an ongoing practice, not a final presentation slide.' },
  ],
  'Prof. Arjun Menon': [
    { title: 'Thermodynamic Cycles', chapter: 'Power and Refrigeration Cycles', subject: 'Thermodynamics', description: 'Summary notes covering system boundaries, process diagrams, and cycle efficiency.', fileType: 'PDF', fileName: 'arjun-menon-thermodynamic-cycles.pdf', uploadedAt: '26 Sep 2026', fileSize: '1.6 MB', content: 'Thermodynamic Cycles\n\nA cycle returns a working fluid to its initial state. Track heat and work transfers consistently, define the system boundary, and use the first law to check energy balance.\n\nFor an engine, thermal efficiency compares useful work output with heat supplied. For refrigeration, the coefficient of performance compares desired heat transfer with work input.' },
    { title: 'CAD Design Intent', chapter: 'Parametric Modelling', subject: 'CAD', description: 'Best practices for sketches, constraints, feature order, and maintaining editable design intent.', fileType: 'DOCX', fileName: 'arjun-menon-cad-design-intent.docx', uploadedAt: '20 Sep 2026', fileSize: '780 KB', content: 'CAD Design Intent\n\nA robust model captures why a dimension exists, not only its current value. Fully constrain sketches, name important features, and build the feature tree in a logical order.\n\nBefore sharing a design, check units, material assumptions, tolerances, and whether a later edit will update dependent features predictably.' },
  ],
};
const facilities = [
  { name: 'Central Library', type: 'Academic', place: 'Main Block · Ground floor', hours: '8:00 AM – 8:00 PM', detail: 'Books, digital library, reading hall', status: 'Open', icon: BookOpen, color: 'mint' },
  { name: 'Innovation Lab', type: 'Academic', place: 'CSE Block · 3rd floor', hours: '9:00 AM – 6:00 PM', detail: 'Prototyping, 3D printing, electronics', status: 'Open', icon: Sparkles, color: 'lilac' },
  { name: 'Campus Medical Room', type: 'Student', place: 'Student Centre · Ground floor', hours: '8:30 AM – 5:30 PM', detail: 'First aid, nurse on duty', status: 'Open', icon: HeartPulse, color: 'rose' },
  { name: 'Green Plate Canteen', type: 'Student', place: 'Student Centre · East wing', hours: '8:00 AM – 6:00 PM', detail: 'Meals, snacks, fresh coffee', status: 'Open', icon: Activity, color: 'gold' },
  { name: 'Placement Cell', type: 'Admin', place: 'Admin Block · 2nd floor', hours: '9:00 AM – 4:30 PM', detail: 'Career guidance, interview rooms', status: 'Open', icon: GraduationCap, color: 'blue' },
  { name: 'Seminar Hall A', type: 'Academic', place: 'Main Block · 1st floor', hours: '8:30 AM – 7:00 PM', detail: '180 seats, hybrid AV setup', status: 'Available', icon: Users, color: 'peach' },
];
const events = [
  { title: 'Build for Good: Campus Hackathon', category: 'Technical', date: '18', month: 'OCT', startsAt: '2026-10-18T09:00:00', endsAt: '2026-10-18T18:00:00', registrationDeadline: '2026-10-16T18:00:00', time: '9:00 AM – 6:00 PM', venue: 'Innovation Lab', host: 'Coding Club', image: 'photo-1516321318423-f06f85e504b3', tone: 'event-green' },
  { title: 'Design Futures · Open Studio', category: 'Workshop', date: '21', month: 'OCT', startsAt: '2026-10-21T14:00:00', endsAt: '2026-10-21T16:30:00', registrationDeadline: '2026-10-20T12:00:00', time: '2:00 PM – 4:30 PM', venue: 'Seminar Hall A', host: 'Design Society', image: 'photo-1513364776144-60967b0f800f', tone: 'event-yellow' },
  { title: 'Rhythm & Roots: Annual Fest', category: 'Cultural', date: '26', month: 'OCT', startsAt: '2026-10-26T17:00:00', endsAt: '2026-10-26T21:00:00', registrationDeadline: '2026-10-24T17:00:00', time: '5:00 PM onwards', venue: 'Open Amphitheatre', host: 'Cultural Council', image: 'photo-1506157786151-b8491531f063', tone: 'event-blue' },
];
const deadlines = [
  { id: 'course-registration', title: 'Course registration closes', description: 'Submit semester course selections in the student portal.', dueAt: '2026-10-02T23:59:00' },
  { id: 'assignment-submission', title: 'Data Structures assignment', description: 'Submit the graph traversal assignment to the course workspace.', dueAt: '2026-10-08T23:59:00' },
  { id: 'exam-registration', title: 'Exam registration deadline', description: 'Review and confirm your end-of-term exam schedule.', dueAt: '2026-10-12T17:00:00' },
  { id: 'scholarship-application', title: 'Scholarship applications close', description: 'Complete the need-based scholarship form and attach supporting documents.', dueAt: '2026-10-20T23:59:00' },
];
const clubs = [
  { name: 'AI & ML Club', category: 'Technology', icon: '✳', tint: 'lilac', members: '84 members', about: 'A curious community building practical, responsible AI through collaborative projects and peer learning.', activities: 'Paper readings, model-building sprints, guest talks', skills: 'Python helpful, not required', level: 'Beginner friendly', time: '2–3 hours per week', benefits: 'Portfolio projects, mentorship, competition experience', match: 'You mentioned Python and AI. Our weekly build sessions are a great place to explore both.' },
  { name: 'Campus Coding Club', category: 'Technology', icon: '</>', tint: 'mint', members: '126 members', about: 'We make problem solving social: weekly challenges, workshops and teams that ship useful things.', activities: 'Dsa circles, hack nights, open-source projects', skills: 'Curiosity and a laptop', level: 'All experience levels', time: '2 hours per week', benefits: 'Technical practice, teamwork, project experience', match: 'Your interest in problem solving maps directly to our weekly challenges.' },
  { name: 'Innovation Society', category: 'Entrepreneurship', icon: '↗', tint: 'gold', members: '52 members', about: 'From first sketch to working prototype, we help students turn campus-sized ideas into real experiments.', activities: 'Idea jams, prototyping, pitch practice', skills: 'Bring an idea or just curiosity', level: 'Beginner friendly', time: '3 hours per week', benefits: 'Leadership, prototyping, presentation skills', match: 'A good fit for career goals that include creating and leading new ideas.' },
  { name: 'Lens & Light', category: 'Arts', icon: '◉', tint: 'peach', members: '38 members', about: 'A welcoming space for visual storytellers, from first-time phone photographers to experienced editors.', activities: 'Photo walks, exhibitions, event coverage', skills: 'No experience needed', level: 'Beginner friendly', time: 'Flexible · 2 hours per week', benefits: 'Creative portfolio, collaboration, visual storytelling', match: 'A relaxed way to build a creative portfolio and meet fellow makers.' },
];
const locations = [
  { name: 'CSE Block', x: 46, y: 38, kind: 'academic' }, { name: 'Central Library', x: 26, y: 53, kind: 'library' },
  { name: 'Student Centre', x: 65, y: 60, kind: 'food' }, { name: 'Main Block', x: 57, y: 26, kind: 'academic' },
  { name: 'Medical Room', x: 78, y: 39, kind: 'medical' }, { name: 'Open Amphitheatre', x: 38, y: 75, kind: 'event' },
  { name: 'Bus Stop · Gate 2', x: 18, y: 25, kind: 'bus' }, { name: 'Sports Complex', x: 77, y: 78, kind: 'sports' },
  { name: 'Innovation Lab', x: 51, y: 34, kind: 'academic' }, { name: 'Campus Medical Room', x: 78, y: 43, kind: 'medical' },
  { name: 'Green Plate Canteen', x: 68, y: 59, kind: 'food' }, { name: 'Placement Cell', x: 62, y: 26, kind: 'academic' },
  { name: 'Seminar Hall A', x: 56, y: 33, kind: 'academic' },
];
const campusRouteInfo = {
  'CSE Block': { distance: 180, minutes: 3, via: 'CSE Walkway', points: [[46, 29], [46, 38]], steps: ['Head south along the CSE Walkway.', 'Continue to the CSE Block entrance.', 'You have arrived at CSE Block.'] },
  'Central Library': { distance: 360, minutes: 5, via: 'Central Quad', points: [[46, 29], [46, 38], [41, 44], [34, 49], [26, 53]], steps: ['Head toward Central Quad.', 'Follow the west walkway past the quad.', 'You have arrived at Central Library.'] },
  'Student Centre': { distance: 320, minutes: 5, via: 'East Walkway', points: [[46, 29], [46, 38], [52, 44], [58, 51], [65, 60]], steps: ['Head south toward Central Quad.', 'Take the east walkway to Student Centre.', 'You have arrived at Student Centre.'] },
  'Main Block': { distance: 260, minutes: 4, via: 'Academic Walk', points: [[46, 29], [51, 28], [57, 26]], steps: ['Head northeast along Academic Walk.', 'Enter Main Block at the north courtyard.', 'You have arrived at Main Block.'] },
  'Medical Room': { distance: 480, minutes: 7, via: 'East Campus Road', points: [[46, 29], [51, 34], [61, 37], [70, 39], [78, 39]], steps: ['Head east toward the campus road.', 'Continue past the Student Centre junction.', 'You have arrived at Medical Room.'] },
  'Campus Medical Room': { distance: 500, minutes: 7, via: 'East Campus Road', points: [[46, 29], [51, 34], [61, 38], [70, 41], [78, 43]], steps: ['Head east toward the campus road.', 'Continue past the Student Centre junction.', 'You have arrived at Campus Medical Room.'] },
  'Green Plate Canteen': { distance: 340, minutes: 5, via: 'Student Centre Walkway', points: [[46, 29], [46, 38], [52, 44], [59, 51], [68, 59]], steps: ['Head south toward Central Quad.', 'Follow signs to the Student Centre east wing.', 'You have arrived at Green Plate Canteen.'] },
  'Innovation Lab': { distance: 220, minutes: 3, via: 'CSE Walkway', points: [[46, 29], [46, 38], [48, 36], [51, 34]], steps: ['Head toward the CSE Block courtyard.', 'Follow the marked walkway to the third floor entrance.', 'You have arrived at Innovation Lab.'] },
  'Placement Cell': { distance: 310, minutes: 5, via: 'Academic Walk', points: [[46, 29], [51, 29], [57, 27], [62, 26]], steps: ['Head northeast along Academic Walk.', 'Continue to Admin Block, second floor.', 'You have arrived at Placement Cell.'] },
  'Seminar Hall A': { distance: 240, minutes: 4, via: 'Main Block Walkway', points: [[46, 29], [49, 31], [52, 33], [56, 33]], steps: ['Head east toward Main Block.', 'Enter Main Block and follow the first-floor signs.', 'You have arrived at Seminar Hall A.'] },
  'Open Amphitheatre': { distance: 620, minutes: 9, via: 'South Walkway', points: [[46, 29], [46, 40], [44, 50], [42, 62], [38, 75]], steps: ['Head south toward Central Quad.', 'Follow the south walkway past the lawn.', 'You have arrived at Open Amphitheatre.'] },
  'Bus Stop · Gate 2': { distance: 540, minutes: 8, via: 'North Gate Road', points: [[46, 29], [40, 28], [31, 26], [18, 25]], steps: ['Head northwest toward the north gate.', 'Follow the marked campus road to Gate 2.', 'You have arrived at Bus Stop · Gate 2.'] },
  'Sports Complex': { distance: 720, minutes: 10, via: 'South East Walkway', points: [[46, 29], [50, 41], [58, 53], [67, 64], [77, 78]], steps: ['Head south toward Central Quad.', 'Continue southeast along the recreation path.', 'You have arrived at Sports Complex.'] },
};
const eventProfiles = {
  'Build for Good: Campus Hackathon': { description: 'A one-day campus hackathon for teams to prototype practical ideas that improve student life and the wider community.', expect: 'Team formation, mentor check-ins, guided build time, and an end-of-day demo showcase.', eligibility: 'Open to all Northfield students. Beginners are welcome; teams of 2–4 are recommended.', deadline: 'October 16 · 6:00 PM', capacity: '120 participants', requirements: 'Bring a laptop and charger. Starter kits and snacks are provided.', contact: 'codingclub@northfield.edu' },
  'Design Futures · Open Studio': { description: 'A hands-on design workshop exploring user research, rapid sketching, and low-fidelity prototyping.', expect: 'Short demonstrations, guided studio exercises, peer critique, and a take-home design brief.', eligibility: 'Open to all students; no prior design experience required.', deadline: 'October 20 · 12:00 PM', capacity: '40 participants', requirements: 'Bring a notebook. Materials are supplied.', contact: 'designsociety@northfield.edu' },
  'Rhythm & Roots: Annual Fest': { description: 'An evening celebrating campus music, dance, food, and student performances at the open amphitheatre.', expect: 'Live performances, student showcases, food stalls, and an open community dance set.', eligibility: 'Open to students, faculty, and invited campus guests.', deadline: 'October 24 · 5:00 PM', capacity: '600 attendees', requirements: 'Bring your campus ID for entry. Outdoor seating is first come, first served.', contact: 'culturalcouncil@northfield.edu' },
};
const clubProfiles = {
  'AI & ML Club': { events: 'Monthly paper circle, Responsible AI forum, and semester-end project showcase', projects: 'Campus FAQ assistant, accessibility captioning study, and small applied ML experiments', who: 'Students curious about AI, data, or responsible technology; beginners are welcome.', schedule: 'Wednesdays · 4:00–5:30 PM', location: 'Innovation Lab · CSE Block, 3rd floor', coordinator: 'Dr. Meera Nair · ai-club@northfield.edu', process: 'Submit the interest form in the club channel. The coordinator will invite you to an orientation session before project teams form.', rules: 'Respectful peer review, responsible data handling, and regular communication with your project team.' },
  'Campus Coding Club': { events: 'Weekly DSA circle, monthly hack night, and beginner-friendly Git workshops', projects: 'Open-source campus tools, peer-built web apps, and programming contest practice', who: 'Anyone interested in programming or problem solving; all experience levels are welcome.', schedule: 'Tuesdays · 5:00–6:30 PM', location: 'CSE Block · Room 110', coordinator: 'Rohan Iyer · codingclub@northfield.edu', process: 'Join the club workspace and attend an orientation. Project groups are open at the start of each semester.', rules: 'Share feedback constructively, credit collaborators, and follow the club code of conduct.' },
  'Innovation Society': { events: 'Idea jams, prototype weekends, founder conversations, and semester pitch night', projects: 'Student-led campus service prototypes and early-stage product experiments', who: 'Students who enjoy building, organizing, or testing new ideas; no business background needed.', schedule: 'Thursdays · 4:30–6:00 PM', location: 'Innovation Lab · CSE Block, 3rd floor', coordinator: 'Nisha Patel · innovation@northfield.edu', process: 'Attend an open idea jam, then sign up for a project team or propose a small experiment.', rules: 'Keep project claims honest, share team responsibilities, and respect feedback and intellectual contributions.' },
  'Lens & Light': { events: 'Photo walks, editing circles, campus exhibition, and event coverage workshops', projects: 'Student portrait series, campus photo archive, and collaborative event stories', who: 'Anyone interested in photography or visual storytelling; a phone camera is enough to start.', schedule: 'Fridays · 3:30–5:00 PM', location: 'Student Centre · Activity Room 2', coordinator: 'Tara Joseph · lenslight@northfield.edu', process: 'Come to a photo walk or message the coordinator. New members can join at any point in the semester.', rules: 'Ask permission before photographing people and follow campus event photography guidance.' },
};
const navItems = [
  { label: 'Overview', icon: Home }, { label: 'Campus map', icon: Compass }, { label: 'Faculty', icon: GraduationCap },
  { label: 'Facilities', icon: DoorOpen }, { label: 'Events', icon: CalendarDays }, { label: 'Clubs', icon: Users },
  { label: 'Notifications', icon: Bell }, { label: 'Bus routes', icon: Bus }, { label: 'My issues', icon: FileText },
];

function LoginPage({ loading, error, onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [validation, setValidation] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!identifier.trim() || !dateOfBirth) {
      setValidation('Enter your USN/Admission Number and Date of Birth.');
      return;
    }
    setValidation('');
    await onLogin(identifier, dateOfBirth);
  };

  return <div className="login-shell"><div className="login-panel"><div className="brand login-brand"><div className="brand-mark"><span>c</span><span>+</span></div><div><b>campus<span>connect</span></b><small>SMART CAMPUS COMPANION</small></div></div><div className="login-heading"><span className="eyebrow">NORTHFIELD COLLEGE · STUDENT PORTAL</span><h1>Welcome back.</h1><p>Sign in to find your way around campus, stay updated, and keep your college day connected.</p></div><form className="login-form" onSubmit={submit} noValidate><label>USN / Admission Number<input value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Enter your USN or admission number" autoComplete="username" aria-invalid={Boolean(validation || error)} /></label><label>Date of Birth<input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} autoComplete="bday" aria-invalid={Boolean(validation || error)} /></label>{(validation || error) && <div className="login-error" role="alert"><ShieldAlert size={15} />{validation || error}</div>}<button className="primary-button login-submit" type="submit" disabled={loading}>{loading ? <><span className="login-spinner" /> Signing you in...</> : <>Enter student portal <ArrowRight size={16} /></>}</button></form><div className="login-note"><Shield size={14} /><span>Your student session is handled securely for this prototype. Date of birth is used only for sign-in verification.</span></div></div><div className="login-art" aria-hidden="true"><div className="login-art-sun" /><div className="login-art-building building-back"><i /><i /><i /></div><div className="login-art-building building-front"><i /><i /><i /><i /></div><div className="login-art-tree tree-one"><i /></div><div className="login-art-tree tree-two"><i /></div><div className="login-art-copy"><span>EVERYTHING YOU NEED ON CAMPUS</span><strong>In one place.</strong></div></div></div>;
}

function App() {
  const [authUser, setAuthUser] = useState(() => getAuthSession()?.user || null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [page, setPage] = useState('Overview');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState('');
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [destination, setDestination] = useState('CSE Block');
  const [navigation, setNavigation] = useState(null);
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [facultyFilter, setFacultyFilter] = useState('All departments');
  const [clubApplications, setClubApplications] = useLocalStorageState('campusconnect.clubApplications', []);
  const [savedEvents, setSavedEvents] = useLocalStorageState('campusconnect.eventReminders', []);
  const [registeredEvents, setRegisteredEvents] = useLocalStorageState('campusconnect.eventRegistrations', []);
  const [readNotifications, setReadNotifications] = useLocalStorageState('campusconnect.readNotifications', {});
  const [now, setNow] = useState(() => new Date());
  const [complaints, setComplaints] = useState([{ id: 'CMP-10231', title: 'Wi-Fi connectivity · Library', status: 'In progress', date: 'Oct 12' }, { id: 'CMP-10198', title: 'Projector not working · CSE-302', status: 'Resolved', date: 'Oct 08' }]);
  const [sosType, setSosType] = useState('');
  const [clubAnswers, setClubAnswers] = useState({ interests: '', skills: '', goal: '' });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const login = async (identifier, dateOfBirth) => {
    setAuthLoading(true);
    setAuthError('');
    const user = await authenticateStudent(identifier, dateOfBirth);
    if (!user) {
      setAuthError('Invalid USN/Admission Number or Date of Birth.');
      setAuthLoading(false);
      return;
    }
    storeAuthSession(user);
    setAuthUser(user);
    setAuthLoading(false);
  };

  const logout = () => {
    clearAuthSession();
    setAuthUser(null);
    setProfileMenuOpen(false);
    setModal('');
    setNavigation(null);
    setPage('Overview');
  };

  const joined = clubApplications.map((application) => application.clubName);
  const setJoined = (update) => setClubApplications((applications) => {
    const currentNames = applications.map((application) => application.clubName);
    const nextNames = typeof update === 'function' ? update(currentNames) : update;
    return nextNames.map((clubName) => applications.find((application) => application.clubName === clubName) || {
      clubName,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
    });
  });
  const updateClubApplicationStatus = (clubName, status) => setClubApplications((applications) => applications.map((application) => application.clubName === clubName
    ? { ...application, status, updatedAt: new Date().toISOString() }
    : application));

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  useEffect(() => {
    const refreshTime = () => setNow(new Date());
    const interval = window.setInterval(refreshTime, 60_000);
    window.addEventListener('focus', refreshTime);
    document.addEventListener('visibilitychange', refreshTime);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshTime);
      document.removeEventListener('visibilitychange', refreshTime);
    };
  }, []);

  const notificationItems = useMemo(() => {
    const items = [];
    const add = (item) => items.push({ ...item, unread: !readNotifications[item.id] });
    registeredEvents.forEach((title) => {
      const event = events.find((item) => item.title === title);
      if (!event) return;
      add({ id: `registration:${title}`, type: 'event', title: `Registration confirmed · ${event.title}`, description: `${event.date} ${event.month} · ${event.time} · ${event.venue}`, date: new Date(event.startsAt) });
    });
    savedEvents.forEach((title) => {
      const event = events.find((item) => item.title === title);
      if (!event) return;
      const startsAt = new Date(event.startsAt);
      const dayOfReminder = new Date(startsAt.getFullYear(), startsAt.getMonth(), startsAt.getDate(), 7);
      const beforeReminder = new Date(startsAt.getTime() - 60 * 60 * 1000);
      add({ id: `reminder:${title}`, type: 'reminder', title: `Reminder set · ${event.title}`, description: `${event.date} ${event.month} · ${event.time} · ${event.venue}. Reminder at 7:00 AM on the day and one hour before.`, date: beforeReminder });
      if (now >= dayOfReminder && now < new Date(startsAt.getTime() + 2 * 60 * 60 * 1000)) {
        add({ id: `reminder-day:${title}`, type: 'reminder', title: `Today · ${event.title}`, description: `${event.time} · ${event.venue}`, date: dayOfReminder });
      }
      if (now >= beforeReminder && now < new Date(startsAt.getTime() + 2 * 60 * 60 * 1000)) {
        add({ id: `reminder-before:${title}`, type: 'reminder', title: `Starting soon · ${event.title}`, description: `${event.time} · ${event.venue}`, date: beforeReminder });
      }
    });
    clubApplications.forEach((application) => {
      const requestedAt = new Date(application.requestedAt);
      add({ id: `club:${application.clubName}:${application.status}`, type: 'club', title: `${application.clubName} · ${application.status}`, description: `Application submitted ${requestedAt.toLocaleDateString()}. ${application.status === 'Pending' ? 'The club coordinator will follow up.' : 'Open your club details to review the latest status.'}`, date: new Date(application.updatedAt || application.requestedAt) });
    });
    deadlines.forEach((deadline) => {
      const dueAt = new Date(deadline.dueAt);
      const hoursLeft = (dueAt.getTime() - now.getTime()) / 3_600_000;
      if (hoursLeft < -24 * 7) return;
      const urgency = hoursLeft < 0 ? 'Overdue' : hoursLeft <= 24 ? 'Due today' : hoursLeft <= 72 ? 'Due soon' : 'Upcoming';
      add({ id: `deadline:${deadline.id}`, type: 'deadline', title: deadline.title, description: `${deadline.description} · ${urgency}`, date: dueAt, urgency });
    });
    return items.sort((first, second) => first.date - second.date);
  }, [clubApplications, now, readNotifications, registeredEvents, savedEvents]);
  const unreadNotificationCount = notificationItems.filter((item) => item.unread).length;
  const markNotificationRead = (id) => setReadNotifications((current) => ({ ...current, [id]: true }));
  const markAllNotificationsRead = () => setReadNotifications((current) => ({
    ...current,
    ...Object.fromEntries(notificationItems.map((item) => [item.id, true])),
  }));
  const startNavigation = (target) => {
    const match = locations.find((item) => item.name === target) || locations[0];
    setDestination(match.name);
    setNavigation({ destination: match.name, step: 0 });
    setPage('Campus map');
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const advanceNavigation = () => setNavigation((current) => current ? { ...current, step: Math.min(current.step + 1, 2) } : current);
  const stopNavigation = () => setNavigation(null);
  const toggleEventReminder = (title) => {
    const isSaved = savedEvents.includes(title);
    setSavedEvents((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
    if (!isSaved) setReadNotifications((current) => ({
      ...current,
      [`reminder:${title}`]: false,
      [`reminder-day:${title}`]: false,
      [`reminder-before:${title}`]: false,
    }));
  };
  const go = (label) => { setPage(label); setMobileNav(false); setQuery(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    const found = [
      ...locations.filter((item) => item.name.toLowerCase().includes(term)).map((item) => ({ name: item.name, section: 'Campus map', icon: MapPin })),
      ...faculty.filter((item) => `${item.name} ${item.dept} ${item.room} ${item.subjects}`.toLowerCase().includes(term)).map((item) => ({ name: item.name, section: 'Faculty', icon: GraduationCap })),
      ...facilities.filter((item) => `${item.name} ${item.type} ${item.detail}`.toLowerCase().includes(term)).map((item) => ({ name: item.name, section: 'Facilities', icon: DoorOpen })),
      ...events.filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(term)).map((item) => ({ name: item.title, section: 'Events', icon: CalendarDays })),
      ...clubs.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(term)).map((item) => ({ name: item.name, section: 'Clubs', icon: Users })),
    ];
    return found.slice(0, 6);
  }, [query]);

  const openSOS = () => { setSosType(''); setModal('sos'); };
  const submitComplaint = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get('title') || 'Campus issue';
    const id = `CMP-${Math.floor(10300 + Math.random() * 600)}`;
    setComplaints((items) => [{ id, title: `${title} · ${form.get('location') || 'Campus'}`, status: 'Submitted', date: 'Just now' }, ...items]);
    setModal(''); go('My issues'); notify(`Issue submitted · ${id}`);
  };

  if (!authUser) {
    return <LoginPage loading={authLoading} error={authError} onLogin={login} />;
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><span>c</span><span>+</span></div><div><b>campus<span>connect</span></b><small>SMART CAMPUS COMPANION</small></div><button className="icon-button close-sidebar" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18} /></button></div>
      <div className="campus-picker"><div className="campus-emblem"><GraduationCap size={18} /></div><div><strong>Northfield College</strong><span>Student portal</span></div><ChevronDown size={15} /></div>
      <div className="nav-label">YOUR CAMPUS</div>
      <nav className="side-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => go(label)}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'My issues' && <span className="nav-count">2</span>}</button>)}</nav>
      <div className="nav-label tools-label">QUICK ACTIONS</div>
      <button className="nav-item" onClick={() => setModal('complaint')}><MessageSquareText size={18} /><span>Report an issue</span><Plus size={15} className="nav-plus" /></button>
      <button className="nav-item" onClick={openSOS}><ShieldAlert size={18} /><span>Emergency SOS</span></button>
      <div className="sidebar-spacer" />
      <div className="help-card"><div className="help-icon"><LifeBuoy size={17} /></div><strong>Need a hand?</strong><p>Campus support is here for you.</p><button onClick={() => notify('Campus support: support@northfield.edu')}>Get support <ArrowRight size={14} /></button></div>
      <button className="profile-mini" onClick={() => setProfileMenuOpen((value) => !value)}><img src={authUser.photo} alt={authUser.name} /><span><strong>{authUser.name}</strong><small>{authUser.department} · Year {authUser.year}</small></span><ChevronDown size={15} /></button>
    </aside>
    {mobileNav && <button className="nav-backdrop" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
    <main className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb">Northfield College <ChevronRight size={14} /> <strong>{page}</strong></div><div className="top-actions"><div className="global-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campus..." aria-label="Search campus" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}{searchResults.length > 0 && <div className="search-results">{searchResults.map((item, index) => <button key={`${item.name}-${index}`} onClick={() => { go(item.section); setQuery(''); }}><item.icon size={16} /><span>{item.name}</span><small>{item.section}</small></button>)}</div>}{query && searchResults.length === 0 && <div className="search-results no-results">No campus matches yet</div>}</div><NotificationBell notifications={notificationItems} onRead={markNotificationRead} onReadAll={markAllNotificationsRead} viewAll={() => go('Notifications')} /><div className="top-divider" /><div className="profile-menu-anchor"><button className="top-profile" onClick={() => setProfileMenuOpen((value) => !value)}><img src={authUser.photo} alt={authUser.name} /><span>{authUser.name}</span><ChevronDown size={14} /></button>{profileMenuOpen && <div className="profile-menu"><strong>{authUser.name}</strong><small>{authUser.identifier}</small><button onClick={logout}>Logout</button></div>}</div></div></header>
      <div className="page-content">
        {page === 'Overview' && <Dashboard user={authUser} go={go} openSOS={openSOS} setModal={setModal} notify={notify} complaints={complaints} />}
        {page === 'Campus map' && <MapPage destination={destination} setDestination={setDestination} navigation={navigation} startNavigation={startNavigation} stopNavigation={stopNavigation} advanceNavigation={advanceNavigation} notify={notify} />}
        {page === 'Faculty' && <FacultyPage query={query} setQuery={setQuery} facultyFilter={facultyFilter} setFacultyFilter={setFacultyFilter} setModal={setModal} notify={notify} />}
        {page === 'Facilities' && <FacilitiesPage filter={facilityFilter} setFilter={setFacilityFilter} startNavigation={startNavigation} notify={notify} />}
        {page === 'Events' && <EventsPage saved={savedEvents} toggleReminder={toggleEventReminder} setModal={setModal} notify={notify} />}
        {page === 'Clubs' && <ClubsPage joined={joined} setJoined={setJoined} answers={clubAnswers} setAnswers={setClubAnswers} show={showRecommendations} setShow={setShowRecommendations} setModal={setModal} notify={notify} />}
        {page === 'Bus routes' && <BusPage notify={notify} />}
        {page === 'Notifications' && <NotificationsPage notifications={notificationItems} events={events} clubs={clubs} clubApplications={clubApplications} registeredEvents={registeredEvents} deadlines={deadlines} now={now} setModal={setModal} />}
        {page === 'My issues' && <IssuesPage complaints={complaints} setModal={setModal} />}
      </div>
      <footer className="footer"><span>© 2025 Northfield College</span><span>Everything you need on campus, in one place.</span><button onClick={() => notify('Campus support: support@northfield.edu')}>Help & support <ArrowUpRight size={13} /></button></footer>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(''); }}><div className={`modal ${modal === 'sos' ? 'sos-modal' : ''} ${modal.startsWith('faculty:') || modal.startsWith('faculty-notes:') || modal.startsWith('faculty-note:') || modal.startsWith('event:') || modal.startsWith('club:') || modal.startsWith('calendar') || modal.startsWith('deadline:') ? 'modal-detail-shell' : ''}`}>
      <button className="modal-close icon-button" onClick={() => setModal('')} aria-label="Close"><X size={19} /></button>
      {modal === 'sos' && <SOSModal type={sosType} setType={setSosType} close={() => setModal('')} notify={notify} />}
      {modal === 'complaint' && <ComplaintForm submit={submitComplaint} close={() => setModal('')} />}
      {modal.startsWith('facility:') && <FacilityModal facility={facilities.find((item) => item.name === modal.slice(9))} close={() => setModal('')} notify={notify} />}
        {modal.startsWith('faculty:') && <FacultyProfileModal person={faculty.find((item) => item.name === modal.slice(8))} close={() => setModal('')} />}
        {modal.startsWith('faculty-notes:') && <FacultyNotesModal person={faculty.find((item) => item.name === modal.slice(14))} notes={facultyNotes[modal.slice(14)] || []} openNote={(note) => setModal(`faculty-note:${modal.slice(14)}:${note.title}`)} close={() => setModal('')} />}
        {modal.startsWith('faculty-note:') && <FacultyNotePreviewModal person={faculty.find((item) => item.name === modal.slice(13, modal.lastIndexOf(':')))} note={facultyNotes[modal.slice(13, modal.lastIndexOf(':'))]?.find((item) => item.title === modal.slice(modal.lastIndexOf(':') + 1))} close={() => setModal(`faculty-notes:${modal.slice(13, modal.lastIndexOf(':'))}`)} />}
      {modal.startsWith('event:') && <EventDetailsModal event={events.find((item) => item.title === modal.slice(6))} registered={registeredEvents} setRegistered={setRegisteredEvents} close={() => setModal('')} notify={notify} />}
      {modal.startsWith('club:') && <ClubDetailsModal club={clubs.find((item) => item.name === modal.slice(5))} joined={joined} setJoined={setJoined} applications={clubApplications} updateStatus={updateClubApplicationStatus} close={() => setModal('')} notify={notify} />}
      {modal.startsWith('calendar') && <CalendarModal events={events} initialEventTitle={modal.slice(9)} setModal={setModal} />}
      {modal.startsWith('deadline:') && <DeadlineDetailsModal deadline={deadlines.find((item) => item.id === modal.slice(9))} now={now} close={() => setModal('')} />}
    </div></div>}
    {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
  </div>;
}

function NotificationBell({ notifications, onRead, onReadAll, viewAll }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const unreadCount = notifications.filter((item) => item.unread).length;

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!panelRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return <div className="notification-anchor" ref={panelRef}>
    <button className="icon-button notification-button" onClick={() => setOpen((value) => !value)} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={open}>
      <Bell size={19} />{unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? '99+' : unreadCount}</span>}
    </button>
    {open && <section className="notification-panel" aria-label="Campus notifications">
      <div className="notification-panel-head"><div><span className="eyebrow">CAMPUS UPDATES</span><strong>Notifications</strong><small>{unreadCount ? `${unreadCount} unread` : 'All caught up'}</small></div><button onClick={onReadAll} disabled={!unreadCount}>Mark all read</button></div>
      <div className="notification-list">{notifications.length ? notifications.map((item) => {
        const Icon = item.type === 'deadline' ? Clock3 : item.type === 'club' ? Users : item.type === 'reminder' ? Bell : CalendarDays;
        return <article className={`notification-item ${item.unread ? 'unread' : ''} notification-${item.type}`} key={item.id}>
          <span className="notification-type-icon"><Icon size={16} /></span><div className="notification-copy"><div className="notification-title-row"><strong>{item.title}</strong>{item.unread && <i aria-label="Unread" />}</div><p>{item.description}</p><small>{item.date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small>{item.urgency && <span className={`deadline-urgency ${item.urgency === 'Overdue' || item.urgency === 'Due today' ? 'urgent' : ''}`}>{item.urgency}</span>}</div><button className="notification-mark-read" onClick={() => onRead(item.id)} disabled={!item.unread} aria-label={item.unread ? `Mark ${item.title} as read` : `${item.title} read`}><Check size={14} /></button>
        </article>;
      }) : <div className="notification-empty"><Bell size={18} /><strong>No notifications yet</strong><span>Campus updates and reminders will show here.</span></div>}</div><button className="notification-view-all" onClick={() => { setOpen(false); viewAll(); }}>View all notifications <ArrowRight size={13} /></button>
    </section>}
  </div>;
}

function eventStatus(event, now) {
  const current = now.getTime();
  const startsAt = new Date(event.startsAt).getTime();
  const endsAt = new Date(event.endsAt).getTime();
  if (current < startsAt) return 'Upcoming';
  if (current < endsAt) return 'Ongoing';
  return 'Past';
}

function deadlineUrgency(deadline, now) {
  const hoursLeft = (new Date(deadline.dueAt).getTime() - now.getTime()) / 3_600_000;
  if (hoursLeft < 0) return 'Overdue';
  if (hoursLeft <= 24) return 'Due today';
  if (hoursLeft <= 72) return 'Due soon';
  return 'Upcoming';
}

function formatUpdateDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function NotificationsPage({ notifications, events, clubs, clubApplications, registeredEvents, deadlines, now, setModal }) {
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Upcoming', 'Ongoing', 'Deadlines', 'Registrations', 'Clubs', 'Hackathons', 'Events'];
  const updates = useMemo(() => {
    const eventUpdates = events.map((event) => {
      const status = eventStatus(event, now);
      const isHackathon = event.title.toLowerCase().includes('hackathon');
      return { id: `event-update:${event.title}`, kind: 'event', category: isHackathon ? 'Hackathons' : 'Events', title: event.title, description: `Hosted by ${event.host}. ${status === 'Ongoing' ? 'Happening now on campus.' : 'Campus activity for students.'}`, date: event.startsAt, status, event };
    });
    const registrationUpdates = registeredEvents.map((title) => {
      const event = events.find((item) => item.title === title);
      return event ? { id: `registration-update:${title}`, kind: 'registration', category: 'Registrations', title: `Registered · ${event.title}`, description: `${event.venue} · ${event.time}`, date: event.startsAt, status: eventStatus(event, now), event } : null;
    }).filter(Boolean);
    const clubUpdates = clubApplications.map((application) => {
      const club = clubs.find((item) => item.name === application.clubName);
      return club ? { id: `club-update:${club.name}`, kind: 'club', category: 'Clubs', title: `${club.name} · ${application.status}`, description: `Application ${application.status.toLowerCase()}. Submitted ${new Date(application.requestedAt).toLocaleDateString()}.`, date: application.updatedAt || application.requestedAt, status: application.status, club } : null;
    }).filter(Boolean);
    const deadlineUpdates = deadlines.map((deadline) => ({ id: `deadline-update:${deadline.id}`, kind: 'deadline', category: 'Deadlines', title: deadline.title, description: deadline.description, date: deadline.dueAt, status: deadlineUrgency(deadline, now), deadline }));
    const reminderUpdates = notifications.filter((item) => item.type === 'reminder').map((item) => {
      const title = item.title.replace(/^Reminder set · /, '').replace(/^Today · /, '').replace(/^Starting soon · /, '');
      const event = events.find((candidate) => candidate.title === title);
      return event ? { id: `reminder-update:${item.id}`, kind: 'reminder', category: event.title.toLowerCase().includes('hackathon') ? 'Hackathons' : 'Events', title: item.title, description: item.description, date: item.date, status: eventStatus(event, now), event } : null;
    }).filter(Boolean);
    return [...eventUpdates, ...registrationUpdates, ...clubUpdates, ...deadlineUpdates, ...reminderUpdates].sort((first, second) => new Date(first.date) - new Date(second.date));
  }, [clubApplications, clubs, deadlines, events, now, notifications, registeredEvents]);
  const filtered = updates.filter((item) => {
    if (category === 'All') return true;
    if (category === 'Upcoming') return item.kind === 'event' && item.status === 'Upcoming';
    if (category === 'Ongoing') return item.kind === 'event' && item.status === 'Ongoing';
    return item.category === category;
  });
  const openUpdate = (item) => {
    if (item.event) setModal(`event:${item.event.title}`);
    else if (item.club) setModal(`club:${item.club.name}`);
    else if (item.deadline) setModal(`deadline:${item.deadline.id}`);
  };
  return <><PageHeading eyebrow="EVERYTHING IMPORTANT, IN ONE PLACE" title="Notifications & updates" text="Stay close to what is happening across Northfield campus." action={<span className="result-count">{filtered.length} updates</span>} /><div className="filter-tabs notification-filters">{categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}<span>{item === 'All' ? updates.length : updates.filter((update) => item === 'Upcoming' ? update.kind === 'event' && update.status === 'Upcoming' : item === 'Ongoing' ? update.kind === 'event' && update.status === 'Ongoing' : update.category === item).length}</span></button>)}</div><div className="updates-list">{filtered.length ? filtered.map((item) => <article className={`update-card update-${item.kind}`} key={item.id} onClick={() => openUpdate(item)} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter') openUpdate(item); }}><div className="update-card-top"><span className="update-category">{item.category}</span><span className={`update-status status-${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="update-card-meta"><span><CalendarDays size={13} /> {formatUpdateDate(item.date)}</span>{item.event && <><span><Clock3 size={13} /> {item.event.time}</span><span><MapPin size={13} /> {item.event.venue}</span></>}{item.deadline && <span><Clock3 size={13} /> Due {formatUpdateDate(item.deadline.dueAt)}</span>}</div>{item.event && <small className="update-host">Hosted by {item.event.host}{item.event.registrationDeadline ? ` · Registration closes ${formatUpdateDate(item.event.registrationDeadline)}` : ''}</small>}{item.kind !== 'event' && item.kind !== 'reminder' && <ArrowRight className="update-arrow" size={16} />}</article>) : <div className="updates-empty"><Bell size={20} /><strong>No updates in this category</strong><span>New campus activity will appear here automatically.</span></div>}</div></>;
}

function calendarDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function CalendarModal({ events, initialEventTitle, setModal }) {
  const initialEvent = events.find((event) => event.title === initialEventTitle) || events[0];
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialEvent.startsAt));
  const [selectedDate, setSelectedDate] = useState(() => initialEvent.startsAt.slice(0, 10));
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const gridStart = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - monthStart.getDay());
  const calendarDays = Array.from({ length: 42 }, (_, index) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index));
  const eventsByDate = events.reduce((grouped, event) => {
    const date = event.startsAt.slice(0, 10);
    grouped.set(date, [...(grouped.get(date) || []), event]);
    return grouped;
  }, new Map());
  const selectedEvents = eventsByDate.get(selectedDate) || [];
  const moveMonth = (offset) => {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
    setVisibleMonth(nextMonth);
    setSelectedDate(calendarDateKey(nextMonth));
  };

  return <div className="calendar-modal"><div className="calendar-modal-header"><div><span className="eyebrow">CAMPUS EVENTS</span><h2>Event calendar</h2></div><div className="calendar-month-controls"><button className="icon-button" onClick={() => moveMonth(-1)} aria-label="Previous month"><ChevronLeft size={16} /></button><strong>{visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong><button className="icon-button" onClick={() => moveMonth(1)} aria-label="Next month"><ChevronRight size={16} /></button></div></div>
    <div className="calendar-content"><div className="calendar-main"><div className="calendar-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-days">{calendarDays.map((day) => { const key = calendarDateKey(day); const dayEvents = eventsByDate.get(key) || []; return <button key={key} className={`calendar-day ${day.getMonth() !== visibleMonth.getMonth() ? 'outside-month' : ''} ${key === selectedDate ? 'selected' : ''} ${dayEvents.length ? 'has-events' : ''}`} onClick={() => setSelectedDate(key)} aria-label={`${day.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}><span>{day.getDate()}</span>{dayEvents.length > 0 && <i />}</button>; })}</div><small className="calendar-legend"><i /> Event scheduled</small></div>
      <aside className="calendar-day-events"><span className="eyebrow">SELECTED DAY</span><h3>{new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>{selectedEvents.length ? selectedEvents.map((event) => <article className="calendar-event" key={event.title}><span className={`calendar-event-mark ${event.tone}`} /><strong>{event.title}</strong><small>{event.time}</small><small><MapPin size={12} /> {event.venue}</small><button className="text-link" onClick={() => setModal(`event:${event.title}`)}>View details <ArrowRight size={13} /></button></article>) : <p className="calendar-no-events">No campus events scheduled for this date.</p>}</aside>
    </div>
  </div>;
}

function PageHeading({ eyebrow, title, text, action }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div>{action}</div>; }
function SectionTitle({ title, link, onClick, meta }) { return <div className="section-title"><div><h2>{title}</h2>{meta && <span>{meta}</span>}</div>{link && <button className="text-link" onClick={onClick}>{link}<ArrowRight size={15} /></button>}</div>; }
function Dashboard({ user, go, openSOS, setModal, notify, complaints }) {
  const quick = [{ title: 'Navigate campus', sub: 'Find your way around', icon: Compass, color: 'mint', action: () => go('Campus map') }, { title: 'Find faculty', sub: 'People & office hours', icon: GraduationCap, color: 'lilac', action: () => go('Faculty') }, { title: 'Campus facilities', sub: 'Spaces & services', icon: DoorOpen, color: 'gold', action: () => go('Facilities') }, { title: 'Emergency SOS', sub: 'Get help right now', icon: Shield, color: 'rose', action: openSOS, urgent: true }, { title: 'Report an issue', sub: 'We’ll take it from here', icon: MessageSquareText, color: 'blue', action: () => setModal('complaint') }, { title: 'What’s on', sub: 'Events around campus', icon: CalendarDays, color: 'peach', action: () => go('Events') }, { title: 'Find your people', sub: 'Explore student clubs', icon: Users, color: 'mint', action: () => go('Clubs') }, { title: 'Bus routes', sub: 'Plan your commute', icon: Bus, color: 'lilac', action: () => go('Bus routes') }];
  return <><div className="welcome-row"><div><div className="eyebrow">MONDAY, OCTOBER 14, 2025 <span className="live-dot" /> CAMPUS IS OPEN</div><h1>Good morning, {user.name.split(' ')[0]} <span className="wave">✳</span></h1><p>Your campus day, a little more connected.</p></div><button className="location-chip" onClick={() => go('Campus map')}><span className="location-pulse"><MapPin size={15} /></span><span><small>YOU’RE AT</small><strong>{user.campus} · Main Campus</strong></span><ChevronDown size={15} /></button></div>
  <section className="hero-banner"><div className="hero-copy"><div className="hero-kicker"><span className="hero-kicker-dot" /> YOUR DAY, AT A GLANCE</div><h2>Make today<br />a good one.</h2><p>Find your next class, discover something new, or get where you need to go.</p><button onClick={() => go('Campus map')}>Explore campus <ArrowRight size={16} /></button></div><div className="hero-art" aria-hidden="true"><div className="hero-sun" /><div className="hero-path" /><div className="building building-back"><i /><i /><i /><i /></div><div className="building building-front"><i /><i /><i /><i /><i /><i /></div><div className="hero-tree tree-one"><i /></div><div className="hero-tree tree-two"><i /></div><div className="hero-art-label"><MapPin size={14} /> NORTHFIELD CAMPUS <span>·</span> EST. 1986</div><div className="art-pin"><MapPin size={15} /><span>Student Centre</span></div></div></section>
  <section className="quick-section"><SectionTitle title="Your campus toolkit" meta="Everything, one tap away" /><div className="quick-grid">{quick.map(({ title, sub, icon: Icon, color, action, urgent }) => <button className={`quick-card ${urgent ? 'quick-urgent' : ''}`} key={title} onClick={action}><span className={`quick-icon ${color}`}><Icon size={19} /></span>{urgent && <span className="quick-live">24/7</span>}<strong>{title}</strong><small>{sub}</small><ArrowUpRight className="quick-arrow" size={16} /></button>)}</div></section>
  <section className="dashboard-lower"><div className="events-panel"><SectionTitle title="Coming up on campus" link="All events" onClick={() => go('Events')} /><div className="event-list">{events.slice(0, 2).map((event) => <button className="event-row" key={event.title} onClick={() => go('Events')}><span className="event-date"><b>{event.date}</b><small>{event.month}</small></span><span className={`event-thumb ${event.tone}`} style={{ backgroundImage: `url(https://images.unsplash.com/${event.image}?w=180&h=130&fit=crop)` }} /><span className="event-row-copy"><small>{event.category} <i /> {event.time}</small><strong>{event.title}</strong><span><MapPin size={12} />{event.venue}</span></span><ChevronRight size={17} className="row-chevron" /></button>)}</div><div className="event-footer"><span><CalendarDays size={14} /> 3 events this week</span><button onClick={() => go('Events')}>Open calendar <ArrowRight size={14} /></button></div></div>
  <div className="side-widgets"><div className="announcement-panel"><SectionTitle title="Campus notes" link="View all" onClick={() => notify('You’re viewing the latest announcements')} /><div className="announcement"><span className="announcement-tag tag-green">ACADEMIC</span><strong>Mid-semester timetable is live</strong><p>Check room changes for your classes starting next week.</p><small>Today <i /> Registrar’s office</small></div><div className="announcement"><span className="announcement-tag tag-peach">CAMPUS LIFE</span><strong>Library extended hours</strong><p>Open until 10 PM during study week, from October 21.</p><small>Yesterday <i /> Student affairs</small></div></div></div></section>
  <section className="bottom-grid"><div className="issue-summary"><div className="summary-head"><div><span className="summary-icon"><FileText size={17} /></span><div><h3>Your reported issues</h3><small>We’re keeping things moving.</small></div></div><button className="icon-button" onClick={() => go('My issues')} aria-label="View issues"><ArrowUpRight size={16} /></button></div>{complaints.slice(0, 1).map((item) => <div className="issue-progress" key={item.id}><div><span>{item.id}</span><b className="status-pill progress-pill">{item.status}</b></div><strong>{item.title}</strong><div className="mini-timeline"><i className="done" /><i className="done" /><i className="current" /><i /><i /></div><div className="timeline-labels"><span>Submitted</span><span>In progress</span><span>Resolved</span></div></div>)}<button className="issue-view" onClick={() => go('My issues')}>Track all issues <ArrowRight size={14} /></button></div><button className="sos-banner" onClick={openSOS}><div className="sos-banner-icon"><ShieldAlert size={19} /></div><div><small>HERE WHEN YOU NEED IT</small><strong>Campus emergency help</strong><span>Security · Medical · Safety</span></div><span className="sos-arrow"><ArrowUpRight size={17} /></span></button><div className="popular-panel"><div className="popular-head"><div><h3>Popular places</h3><small>Getting a lot of visits today</small></div><MapPin size={17} /></div><div className="popular-places">{['Central Library', 'Student Centre', 'Innovation Lab'].map((name, index) => <button key={name} onClick={() => go('Campus map')}><span className="popular-index">0{index + 1}</span><span>{name}</span><Navigation size={14} /></button>)}</div></div></section>
  <div className="emergency-strip"><span className="strip-icon"><PhoneIcon /></span><div><strong>Emergency contacts</strong><span>Campus security <b>+91 80 4567 8900</b><i /> Medical room <b>Ext. 204</b></span></div><button onClick={() => notify('Campus Security: +91 80 4567 8900')}>View all <ArrowRight size={13} /></button></div>
  </>;
}
function PhoneIcon() { return <Shield size={17} />; }

function MapPage({ destination, setDestination, navigation, startNavigation, stopNavigation, advanceNavigation, notify }) {
  const selected = locations.find((item) => item.name === destination) || locations[0];
  const route = campusRouteInfo[selected.name] || campusRouteInfo['CSE Block'];
  const activeNavigation = navigation?.destination === selected.name;
  const currentStep = activeNavigation ? navigation.step : 0;
  const routePoints = route.points.map(([x, y]) => `${x},${y}`).join(' ');
  return <><PageHeading eyebrow="GET THERE, EASILY" title="Campus map" text="A little less lost. Find your destination and we’ll show you the way." action={<button className="outline-button" onClick={() => notify('Using your approximate campus location')}><Navigation size={15} /> Use my location</button>} />
    <div className="map-toolbar"><div className="map-search"><Search size={17} /><input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Where do you want to go?" list="campus-locations" /><datalist id="campus-locations">{locations.map((loc) => <option key={loc.name} value={loc.name} />)}</datalist><button onClick={() => startNavigation(destination)}>Directions <ArrowRight size={14} /></button></div></div>
    <div className="map-layout"><div className="map-canvas"><div className="map-grid" /><div className="map-water" /><div className="map-park park-one" /><div className="map-park park-two" /><div className="map-road road-horizontal" /><div className="map-road road-vertical" /><div className="map-road road-diagonal" /><div className="map-walk walk-one" /><div className="map-walk walk-two" />
      {activeNavigation && <svg className="campus-route" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 2 }} role="img" aria-label={`Walking route to ${selected.name}`}><polyline className="campus-route-outline" points={routePoints} /><polyline className="campus-route-line" points={routePoints} /><circle className="campus-route-origin" cx="46" cy="29" r="1.6" /><circle className="campus-route-destination" cx={selected.x} cy={selected.y} r="2" /></svg>}
      {locations.map((item) => <button key={item.name} className={`map-point ${item.kind} ${selected.name === item.name ? 'selected' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => navigation ? startNavigation(item.name) : setDestination(item.name)}><span className="point-dot"><MapPin size={13} /></span><span className="point-label">{item.name}</span></button>)}
      <div className="you-are-here"><span /><b>You are here</b><small>Near CSE Block · 2nd floor</small></div><div className="map-controls"><button onClick={() => notify('Map zoomed in')} aria-label="Zoom in">+</button><button onClick={() => notify('Map zoomed out')} aria-label="Zoom out">−</button><button onClick={() => notify('Showing your approximate location')} aria-label="Locate me"><Navigation size={15} /></button></div><div className="map-legend"><span><i className="legend-academic" /> Academic</span><span><i className="legend-food" /> Food</span><span><i className="legend-services" /> Services</span></div><div className="map-attribution">NORTHFIELD · MAIN CAMPUS</div>
    </div><aside className="route-panel"><div className="route-head"><div><span className="eyebrow">{activeNavigation ? 'NAVIGATION MODE' : 'YOUR ROUTE'}</span><h3>To {selected.name}</h3></div><span className="route-compass"><Navigation size={18} /></span></div>
      <div className="route-directions"><div className="route-origin"><span className="origin-dot" /><div><small>STARTING FROM</small><strong>Your current location</strong><span>Near CSE Block · 2nd floor</span></div></div><div className="route-line"><span>Walk via {route.via}</span></div><div className="route-destination"><MapPin size={16} /><div><small>DESTINATION</small><strong>{selected.name}</strong><span>{selected.kind === 'academic' ? 'Academic zone' : 'Campus facility'}</span></div></div></div>
      <div className="route-stats"><div><span><Navigation size={14} /> DISTANCE</span><strong>{route.distance} m</strong></div><div><span><Clock3 size={14} /> WALKING</span><strong>{route.minutes} min</strong></div></div>
      {activeNavigation ? <div className="navigation-progress"><div className="navigation-progress-head"><span>STEP {currentStep + 1} OF 3</span><span>{Math.round(((currentStep + 1) / 3) * 100)}%</span></div><div className="navigation-progress-track"><i style={{ width: `${((currentStep + 1) / 3) * 100}%` }} /></div><strong>{route.steps[currentStep]}</strong><div className="navigation-actions">{currentStep < 2 && <button className="primary-button" onClick={advanceNavigation}>Next step <ArrowRight size={14} /></button>}<button className="outline-button" onClick={stopNavigation}>Stop navigation</button></div></div> : <button className="primary-button full-button" onClick={() => startNavigation(selected.name)}><Navigation size={16} /> Start directions</button>}
      <div className="nearby-title"><strong>Along the way</strong><span>NEARBY</span></div><button className="nearby-row" onClick={() => navigation ? startNavigation('Central Library') : setDestination('Central Library')}><span className="nearby-icon mint"><BookOpen size={15} /></span><span><b>Central Library</b><small>Open · 8:00 AM – 8:00 PM</small></span><small>120 m</small></button><button className="nearby-row" onClick={() => navigation ? startNavigation('Green Plate Canteen') : setDestination('Green Plate Canteen')}><span className="nearby-icon gold"><Activity size={15} /></span><span><b>Green Plate Canteen</b><small>Open · Food & coffee</small></span><small>200 m</small></button><div className="privacy-note"><Shield size={13} /> Your location is only visible to you.</div>
    </aside></div><div className="map-categories"><span>EXPLORE BY CATEGORY</span>{['Academic blocks', 'Food & drink', 'Health & safety', 'Bus stops', 'Sports'].map((label, index) => <button key={label} onClick={() => setDestination(locations[index].name)}>{label}<ArrowUpRight size={13} /></button>)}</div></>;
}

function facultyBuilding(person) {
  if (person.room.startsWith('CSE')) return 'CSE Block';
  if (person.room.startsWith('ECE')) return 'ECE Block';
  return 'Mechanical Block';
}

function FacultyPage({ query, setQuery, facultyFilter, setFacultyFilter, setModal, notify }) {
  const [opened, setOpened] = useState(null);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [designationFilter, setDesignationFilter] = useState('All designations');
  const [buildingFilter, setBuildingFilter] = useState('All buildings');
  const [subjectFilter, setSubjectFilter] = useState('All subjects');
  const subjects = [...new Set(faculty.flatMap((person) => person.subjects.split(',').map((subject) => subject.trim())))];
  const filtered = faculty.filter((person) => {
    const searchText = `${person.name} ${person.role} ${person.dept} ${person.subjects} ${person.room} ${facultyBuilding(person)}`.toLowerCase();
    return (facultyFilter === 'All departments' || person.dept === facultyFilter)
      && (designationFilter === 'All designations' || person.role === designationFilter)
      && (buildingFilter === 'All buildings' || facultyBuilding(person) === buildingFilter)
      && (subjectFilter === 'All subjects' || person.subjects.toLowerCase().includes(subjectFilter.toLowerCase()))
      && (!query.trim() || searchText.includes(query.trim().toLowerCase()));
  });
  const filtersActive = query || facultyFilter !== 'All departments' || designationFilter !== 'All designations' || buildingFilter !== 'All buildings' || subjectFilter !== 'All subjects';
  const clearFilters = () => { setQuery(''); setFacultyFilter('All departments'); setDesignationFilter('All designations'); setBuildingFilter('All buildings'); setSubjectFilter('All subjects'); };
  return <><PageHeading eyebrow="PEOPLE MAKE THIS PLACE" title="Faculty directory" text="Find the right person, know when they’re free, and get to their office." action={<span className="result-count">{filtered.length} faculty</span>} />
    <div className="directory-toolbar"><div className="directory-search"><Search size={16} /><input placeholder="Search by name, subject, room..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><select value={facultyFilter} onChange={(event) => setFacultyFilter(event.target.value)} aria-label="Filter department"><option>All departments</option><option>Computer Science</option><option>Electronics</option><option>Mechanical</option></select><button className="outline-button" aria-expanded={moreFiltersOpen} onClick={() => setMoreFiltersOpen((value) => !value)}><Filter size={15} /> More filters</button></div>
    {moreFiltersOpen && <div className="faculty-more-filters"><select value={designationFilter} onChange={(event) => setDesignationFilter(event.target.value)} aria-label="Filter designation"><option>All designations</option>{[...new Set(faculty.map((person) => person.role))].map((role) => <option key={role}>{role}</option>)}</select><select value={buildingFilter} onChange={(event) => setBuildingFilter(event.target.value)} aria-label="Filter building"><option>All buildings</option>{[...new Set(faculty.map(facultyBuilding))].map((building) => <option key={building}>{building}</option>)}</select><select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} aria-label="Filter subject"><option>All subjects</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select>{filtersActive && <button className="text-link" onClick={clearFilters}>Clear filters <X size={13} /></button>}</div>}
    <div className="faculty-grid">{filtered.map((person) => <article className="faculty-card" key={person.name}><div className="faculty-card-top"><img src={`https://images.unsplash.com/${person.image}?w=160&h=160&fit=crop&crop=faces`} alt={person.name} /><span className="availability"><i /> In office</span><button className="faculty-more icon-button" onClick={() => setOpened(opened === person.name ? null : person.name)} aria-label={`More about ${person.name}`}><ArrowUpRight size={16} /></button></div><h3>{person.name}</h3><p className="faculty-role">{person.role}</p><span className="dept-tag">{person.dept}</span><div className="faculty-meta"><span><MapPin size={14} /> Room {person.room}</span><span><BookOpen size={14} /> {person.subjects}</span></div>{opened === person.name && <div className="office-hours"><Clock3 size={14} /> Office hours: {person.hours}</div>}<div className="faculty-actions"><button className="outline-button" onClick={() => setModal(`faculty:${person.name}`)}>View profile</button><button className="outline-button" onClick={() => setModal(`faculty-notes:${person.name}`)}>Notes</button></div></article>)}</div>
    <div className="directory-note"><div className="note-icon"><MessageSquareText size={17} /></div><span><strong>Can’t find who you’re looking for?</strong><small>Faculty contact details are maintained by each department.</small></span><button onClick={() => notify('Email directory@northfield.edu')}>Contact directory team <ArrowRight size={14} /></button></div></>;
}

function FacilitiesPage({ filter, setFilter, startNavigation, notify }) {
  const categories = ['All', 'Academic', 'Student', 'Admin'];
  const filtered = facilities.filter((facility) => filter === 'All' || facility.type === filter);
  return <><PageHeading eyebrow="THE PLACES THAT MAKE CAMPUS" title="Facilities & spaces" text="Find a quiet corner, grab a coffee, or get the support you need." /><div className="filter-tabs">{categories.map((category) => <button key={category} className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)}>{category === 'Student' ? 'Student facilities' : category === 'Admin' ? 'Administrative' : category === 'All' ? 'All spaces' : 'Academic'}<span>{category === 'All' ? facilities.length : facilities.filter((item) => item.type === category).length}</span></button>)}</div><div className="facility-grid">{filtered.map((item) => { const Icon = item.icon; return <article className="facility-card" key={item.name}><div className={`facility-icon ${item.color}`}><Icon size={21} /></div><div className="facility-heading"><span className="facility-category">{item.type === 'Admin' ? 'ADMINISTRATIVE' : item.type.toUpperCase()}</span><span className="facility-status"><i />{item.status}</span></div><h3>{item.name}</h3><div className="facility-line"><MapPin size={14} />{item.place}</div><div className="facility-line"><Clock3 size={14} />{item.hours}</div><p className="facility-services">{item.detail}</p><div className="facility-card-actions"><button className="text-link" onClick={() => startNavigation(item.name)}>Navigate <Navigation size={14} /></button><button className="icon-button" onClick={() => notify(`${item.name} details are up to date`)} aria-label={`More about ${item.name}`}><ArrowUpRight size={15} /></button></div></article>; })}</div><div className="facility-help"><span className="facility-help-icon"><LifeBuoy size={19} /></span><div><strong>Something not right?</strong><p>Let us know if a space is closed, unavailable, or needs attention.</p></div><button className="outline-button" onClick={() => notify('Issue reporting opened')}>Report a facility issue <ArrowRight size={14} /></button></div></>;
}

function SOSModal({ type, setType, close, notify }) {
  const options = [{ title: 'Medical emergency', icon: HeartPulse }, { title: 'Accident', icon: Activity }, { title: 'Security issue', icon: Shield }, { title: 'Lost person', icon: Users }, { title: 'Safety concern', icon: ShieldAlert }, { title: 'Other emergency', icon: LifeBuoy }];
  if (type === 'sent') return <div className="sos-confirmation"><div className="sent-icon"><Check size={29} /></div><span className="eyebrow">CAMPUS RESPONSE TEAM</span><h2>Help is on the way.</h2><p>Your alert was shared with campus responders. Stay somewhere safe if you can.</p><div className="alert-ticket"><span>ALERT STATUS</span><strong><i /> Nearby responders notified</strong><small>Location shared privately · CSE Block, 2nd floor</small></div><div className="responder-list"><div><span className="responder-avatar security-avatar"><Shield size={15} /></span><span><b>Campus security</b><small>North gate team · 2 min away</small></span><span className="responder-online">RESPONDING</span></div><div><span className="responder-avatar medical-avatar"><HeartPulse size={15} /></span><span><b>Medical room</b><small>Student Centre · Ext. 204</small></span><span className="responder-online">AVAILABLE</span></div></div><div className="sos-modal-actions"><button className="outline-button" onClick={() => notify('Campus Security · +91 80 4567 8900')}>Contact security <ArrowRight size={14} /></button><button className="primary-button" onClick={close}>I’m safe, close</button></div><small className="privacy-small"><Shield size={12} /> Your location is only shared with campus responders.</small></div>;
  return <div className="sos-flow"><div className="sos-modal-head"><span className="sos-modal-icon"><ShieldAlert size={20} /></span><span className="eyebrow">CAMPUS SAFETY · 24/7</span></div><h2>What type of help<br />do you need?</h2><p>Select an option. We’ll notify campus responders with your approximate location.</p><div className="sos-options">{options.map(({ title, icon: Icon }) => <button key={title} className={type === title ? 'selected' : ''} onClick={() => setType(title)}><Icon size={18} /><span>{title}</span>{type === title && <Check size={15} />}</button>)}</div><div className="sos-location"><MapPin size={15} /><span><small>APPROXIMATE LOCATION</small><strong>CSE Block · 2nd floor</strong></span><span className="location-private"><Shield size={12} /> Private</span></div><button className="sos-send-button" disabled={!type} onClick={() => setType('sent')}><ShieldAlert size={17} /> Send emergency alert</button><div className="sos-direct-call">Need immediate help? <button onClick={() => notify('Calling campus security · +91 80 4567 8900')}>Call campus security <ArrowUpRight size={13} /></button></div><div className="sos-privacy"><Shield size={13} /> Your location is never visible publicly and is only shared with campus responders.</div></div>;
}

function ComplaintForm({ submit, close }) {
  return <form className="complaint-form" onSubmit={submit}><div className="form-eyebrow">CAMPUS CARE · ISSUE REPORT</div><h2>Let’s get it sorted.</h2><p>Tell us what’s happening. The right campus team will take it from here.</p><label>What needs attention?<input name="title" placeholder="e.g. Projector not turning on" required /></label><div className="form-row"><label>Category<select name="category" defaultValue=""><option value="" disabled>Select a category</option>{['Electrical', 'Water', 'Internet / Wi-Fi', 'Classroom', 'Hostel', 'Cleanliness', 'Food quality', 'Security', 'Infrastructure', 'Other'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Priority<select name="priority"><option>Standard</option><option>Urgent</option><option>Low</option></select></label></div><label>Where is it happening?<input name="location" placeholder="Building, floor, or nearby landmark" required /></label><label>A few more details<textarea name="description" placeholder="Help us understand what’s going on..." rows="3" /></label><label className="upload-label"><input type="file" accept="image/*" /><span><Plus size={16} /> Add a photo <small>Optional · JPG or PNG</small></span></label><div className="form-private"><Shield size={13} /> Your report is only visible to you and the relevant campus team.</div><div className="form-actions"><button type="button" className="outline-button" onClick={close}>Cancel</button><button className="primary-button" type="submit">Send report <ArrowRight size={15} /></button></div></form>;
}

function IssuesPage({ complaints, setModal }) {
  const openCount = complaints.filter((item) => item.status !== 'Resolved').length;
  const resolvedCount = complaints.filter((item) => item.status === 'Resolved').length;
  return <><PageHeading eyebrow="YOUR REPORTS, WITH YOU" title="Issues & reports" text="Follow progress on your reports. Your personal details stay private." action={<button className="primary-button" onClick={() => setModal('complaint')}><Plus size={16} /> New report</button>} /><div className="issue-stats"><div><small>OPEN</small><strong>{openCount}</strong><span>Being looked into</span><ArrowUpRight size={16} /></div><div><small>IN PROGRESS</small><strong>{complaints.filter((item) => item.status === 'In progress').length}</strong><span>With a campus team</span><Activity size={16} /></div><div><small>RESOLVED</small><strong>{resolvedCount}</strong><span>Closed this semester</span><CheckCircle2 size={17} /></div><div className="issue-stat-note"><span className="note-icon"><Sparkles size={17} /></span><strong>Small reports<br />make a better campus.</strong><span>Thanks for looking out for your community.</span></div></div><div className="issue-content-grid"><div className="reports-panel"><SectionTitle title="Your reports" meta={`${complaints.length} total`} /><div className="report-table-head"><span>REPORT</span><span>DATE</span><span>STATUS</span><span>ID</span></div>{complaints.map((item, index) => <div className="report-row" key={item.id}><span className="report-title"><i className={item.status === 'Resolved' ? 'resolved-dot' : ''} /><b>{item.title}</b><small>{index === 0 ? 'Facilities & maintenance' : 'Academic technology'}</small></span><span>{item.date}</span><span><b className={`status-pill ${item.status === 'Resolved' ? 'resolved-pill' : item.status === 'Submitted' ? 'submitted-pill' : 'progress-pill'}`}>{item.status}</b></span><span className="report-id">{item.id}</span></div>)}</div><aside className="issue-side-panel"><span className="eyebrow">YOUR LATEST UPDATE</span><h3>Wi-Fi connectivity<br />Library · 1st floor</h3><span className="status-pill progress-pill">Work in progress</span><div className="issue-full-timeline"><div className="timeline-step completed"><i /><span><b>Submitted</b><small>Oct 12 · 10:42 AM</small></span></div><div className="timeline-step completed"><i /><span><b>Assigned to IT services</b><small>Oct 12 · 11:18 AM</small></span></div><div className="timeline-step active"><i /><span><b>Work in progress</b><small>Network team is investigating</small></span></div><div className="timeline-step"><i /><span><b>Awaiting verification</b></span></div><div className="timeline-step"><i /><span><b>Resolved</b></span></div></div><button className="issue-message-button"><MessageSquareText size={14} /> Message support team</button></aside></div><div className="issue-privacy"><Shield size={16} /><div><strong>Personal reports are private.</strong><span>Campus issue trends are shared in aggregate only. Your name and location are never shown to other students.</span></div><button>Privacy details <ArrowRight size={13} /></button></div></>;
}

function EventsPage({ saved, toggleReminder, setModal, notify }) {
  const [category, setCategory] = useState('All events');
  const tags = ['All events', 'Technical', 'Workshop', 'Cultural'];
  const filtered = events.filter((item) => category === 'All events' || item.category === category);
  return <><PageHeading eyebrow="GOOD THINGS ARE HAPPENING" title="Campus events" text="Find your next idea, new skill, or favourite campus memory." action={<button className="outline-button" onClick={() => setModal('calendar')}><CalendarDays size={15} /> My calendar</button>} /><div className="events-feature"><div className="events-feature-image" style={{ backgroundImage: `url(https://images.unsplash.com/${events[0].image}?w=1000&h=620&fit=crop)` }} /><div className="feature-overlay"><span className="feature-pill"><Sparkles size={13} /> THIS WEEK’S PICK</span><h2>Build for Good.<br />Make it real.</h2><p>A day to turn your best ideas into tools that make campus better.</p><div><span><CalendarDays size={14} /> Saturday, Oct 18</span><span><MapPin size={14} /> Innovation Lab</span></div><button onClick={() => setModal(`event:${events[0].title}`)}>Explore event <ArrowRight size={15} /></button></div></div><div className="filter-tabs event-filters">{tags.map((tag) => <button key={tag} className={category === tag ? 'selected' : ''} onClick={() => setCategory(tag)}>{tag}<span>{tag === 'All events' ? events.length : events.filter((item) => item.category === tag).length}</span></button>)}</div><div className="event-cards">{filtered.map((event) => <article className="event-card" key={event.title}><div className={`event-card-image ${event.tone}`} style={{ backgroundImage: `url(https://images.unsplash.com/${event.image}?w=700&h=360&fit=crop)` }}><span className="event-category-chip">{event.category}</span><span className="event-card-date"><b>{event.date}</b><small>{event.month}</small></span></div><div className="event-card-content"><span className="event-organizer">HOSTED BY {event.host.toUpperCase()}</span><h3>{event.title}</h3><div className="event-details"><span><Clock3 size={14} />{event.time}</span><span><MapPin size={14} />{event.venue}</span></div><p>Meet people who care about good ideas and get hands-on with something new. Open to all Northfield students.</p><div className="event-card-actions"><button className="primary-button" onClick={() => setModal(`event:${event.title}`)}>Details <ArrowRight size={14} /></button><button className={`event-save ${saved.includes(event.title) ? 'is-saved' : ''}`} onClick={() => { toggleReminder(event.title); notify(saved.includes(event.title) ? 'Reminder removed' : 'Reminder set'); }}><Bell size={15} />{saved.includes(event.title) ? 'Reminder set' : 'Remind me'}</button><button className="event-calendar" onClick={() => setModal(`calendar:${event.title}`)} aria-label={`Open calendar for ${event.title}`}><CalendarDays size={15} /></button></div></div></article>)}</div><div className="announcement-banner"><span className="announcement-banner-icon"><Bell size={17} /></span><div><span className="eyebrow">IMPORTANT ANNOUNCEMENT</span><strong>Mid-semester timetable is live</strong><p>Review your updated room assignments and timings before classes begin next week.</p></div><button onClick={() => notify('Timetable notice opened')}>Read notice <ArrowRight size={14} /></button></div></>;
}

function ClubsPage({ joined, answers, setAnswers, show, setShow, setModal, notify }) {
  const recommended = (answers.interests.toLowerCase().includes('photo') ? [clubs[3], clubs[0], clubs[2]] : answers.goal.toLowerCase().includes('creative') ? [clubs[3], clubs[2], clubs[1]] : [clubs[0], clubs[1], clubs[2]]);
  const [clubCategory, setClubCategory] = useState('All categories');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const clubCategories = ['All categories', ...new Set(clubs.map((club) => club.category))];
  const displayed = show ? recommended : clubs.filter((club) => clubCategory === 'All categories' || club.category === clubCategory);
  return <><PageHeading eyebrow="FIND YOUR PEOPLE" title="Clubs & communities" text="Try something new, build something together, or just find your corner of campus." action={<span className="result-count">38 student clubs</span>} /><section className="club-recommend"><div className="recommend-copy"><span className="recommend-spark"><Sparkles size={17} /></span><div><span className="eyebrow">A LITTLE HELP FINDING YOUR FIT</span><h2>Your interests have a home here.</h2><p>Tell us what you’re into. We’ll suggest a few clubs to get you started.</p></div></div><div className="recommend-form"><label>What are you curious about?<input value={answers.interests} onChange={(event) => setAnswers({ ...answers, interests: event.target.value })} placeholder="e.g. Python, design, football" /></label><label>What do you want to build?<input value={answers.goal} onChange={(event) => setAnswers({ ...answers, goal: event.target.value })} placeholder="e.g. confidence, projects, friendships" /></label><button className="primary-button" onClick={() => { setShow(true); setCategoryOpen(false); }}><Sparkles size={15} /> Find my clubs</button></div>{show && <div className="recommend-result"><span><CheckCircle2 size={15} /> A few good places to start</span><p>{recommended.map((club) => club.name).join(' · ')}</p></div>}</section><div className="club-list-heading"><div><span className="eyebrow">38 COMMUNITIES, ONE CAMPUS</span><h2>{show ? 'Picked for you' : 'Explore clubs'}</h2></div><button className="outline-button" onClick={() => { if (show) { setShow(false); setClubCategory('All categories'); } else { setCategoryOpen((value) => !value); } }}><Filter size={14} /> {show ? 'Browse all' : categoryOpen ? 'Hide categories' : 'Browse categories'} <ChevronDown size={14} /></button></div>{categoryOpen && !show && <div className="filter-tabs club-category-filters">{clubCategories.map((category) => <button key={category} className={clubCategory === category ? 'selected' : ''} onClick={() => setClubCategory(category)}>{category}<span>{category === 'All categories' ? clubs.length : clubs.filter((club) => club.category === category).length}</span></button>)}</div>}<div className="club-grid">{displayed.map((club) => <article className="club-card" key={club.name}><div className="club-card-top"><span className={`club-emblem ${club.tint}`}>{club.icon}</span><span className="club-category">{club.category}</span><button className="icon-button club-more" onClick={() => notify(`${club.name} · ${club.members}`)} aria-label={`More about ${club.name}`}><ArrowUpRight size={15} /></button></div><h3>{club.name}</h3><p className="club-about">{club.about}</p><div className="club-card-facts"><div><small>ACTIVITIES</small><span>{club.activities}</span></div><div><small>EXPERIENCE</small><span>{club.level} · {club.skills}</span></div><div><small>TIME COMMITMENT</small><span>{club.time}</span></div></div>{show && <div className="club-match"><Sparkles size={14} /><span>{club.match}</span></div>}<details className="club-details"><summary>Why should I join this club? <ChevronDown size={14} /></summary><p>{club.benefits}. Experience may help you build relevant skills and a stronger portfolio, but outcomes depend on your own goals and effort.</p><div className="club-extra"><span><b>Projects</b> Team-built campus tools</span><span><b>Competitions</b> Hackathons & showcases</span><span><b>Contact</b> {club.name.toLowerCase().replaceAll(' ', '')}@northfield.edu</span></div></details><button className="club-join" onClick={() => setModal(`club:${club.name}`)}><Users size={15} /> More details <ArrowRight size={14} /></button></article>)}</div><div className="club-footnote"><Shield size={14} /><span>Club experience can build skills, teamwork, and project confidence. It doesn’t guarantee any career outcome.</span></div></>;
}

function BusPage({ notify }) {
  const [active, setActive] = useState('12');
  const [expanded, setExpanded] = useState(false);
  const routes = [{ no: '12', name: 'Route A · North Loop', start: 'Northfield College', stops: ['Yelahanka', 'Hebbal', 'Nagawara'], end: 'Manyata Tech Park', morning: '7:15 AM', evening: '5:30 PM', days: 'Weekdays' }, { no: '08', name: 'Route B · South Link', start: 'Northfield College', stops: ['Jayanagar', 'BTM Layout', 'Silk Board'], end: 'Electronic City', morning: '7:00 AM', evening: '5:45 PM', days: 'Weekdays' }, { no: '21', name: 'Route C · West Connector', start: 'Northfield College', stops: ['Rajajinagar', 'Vijayanagar', 'Kengeri'], end: 'Kengeri Metro', morning: '7:30 AM', evening: '5:15 PM', days: 'Weekdays + Saturday' }];
  const route = routes.find((item) => item.no === active) || routes[0];
  return <><PageHeading eyebrow="A BETTER WAY TO GET THERE" title="Campus bus routes" text="Plan your ride in and out of campus. Timings are estimates and may shift with traffic." action={<button className="outline-button" onClick={() => notify('Showing nearest stop: Main Gate · 3 min walk')}><MapPin size={15} /> Nearest stop</button>} /><div className="bus-overview"><div className="bus-overview-copy"><span className="bus-overline"><span /> LIVE CAMPUS SERVICE</span><h2>Your campus<br />is closer than you think.</h2><p>Three weekday routes connect Northfield to the places you need to be.</p><div className="bus-overview-stats"><span><b>3</b> daily routes</span><i /><span><b>18</b> city stops</span><i /><span><b>Mon–Sat</b> service</span></div></div><div className="bus-illustration"><div className="sun-disc" /><div className="bus-building"><i /><i /><i /></div><div className="bus-vehicle"><span className="bus-windshield" /><span className="bus-window" /><span className="bus-door" /><i /><i /></div><div className="bus-road-line" /></div></div><div className="route-selector">{routes.map((item) => <button key={item.no} className={active === item.no ? 'selected' : ''} onClick={() => { setActive(item.no); setExpanded(false); }}><span className="route-number">{item.no}</span><span><strong>{item.name}</strong><small>{item.stops[0]} · {item.stops[1]} · {item.stops[2]}</small></span><ChevronRight size={17} /></button>)}</div><div className="bus-detail"><div className="bus-detail-top"><div><span className="eyebrow">ROUTE {route.no} · {route.days.toUpperCase()}</span><h2>{route.name}</h2></div><button className="outline-button" onClick={() => setExpanded(!expanded)}><MapPin size={15} /> {expanded ? 'Hide route map' : 'View route'}</button></div><div className="route-track"><div className="route-stop start-stop"><i /><strong>{route.start}</strong><small>{route.morning} · Morning departure</small></div>{route.stops.map((stop, index) => <div className="route-stop" key={stop}><i /><strong>{stop}</strong><small>Stop {index + 1}</small></div>)}<div className="route-stop end-stop"><i /><strong>{route.end}</strong><small>Evening return · {route.evening}</small></div></div>{expanded && <div className="bus-route-map"><div className="route-map-line" /><span className="route-map-pin pin-a"><MapPin size={15} /> Northfield College</span><span className="route-map-pin pin-b"><MapPin size={15} /> {route.stops[1]}</span><span className="route-map-pin pin-c"><MapPin size={15} /> {route.end}</span><small>SCHEMATIC ROUTE · NOT TO SCALE</small></div>}<div className="bus-detail-footer"><span><Clock3 size={15} /><b>Morning</b> {route.morning}</span><span><Clock3 size={15} /><b>Evening return</b> {route.evening}</span><span><MapPin size={15} /><b>Board at</b> Main Gate · stop 1</span><button className="primary-button" onClick={() => notify(`Reminder set for Route ${route.no} at ${route.morning}`)}><Bell size={15} /> Set a reminder</button></div></div><div className="bus-notice"><span><Bus size={17} /></span><div><strong>Timings can change with traffic.</strong><small>Arrive at your stop 5 minutes early. For route updates, contact transport services at Ext. 118.</small></div><button onClick={() => notify('Transport services · Ext. 118')}>Transport help <ArrowRight size={14} /></button></div></>;
}

function downloadFacultyNote(note) {
  if (!note) return;
  const mimeTypes = { PDF: 'application/pdf', DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
  const blob = new Blob([note.content], { type: mimeTypes[note.fileType] || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = note.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function FacultyNotesModal({ person, notes, openNote, close }) {
  if (!person) return null;
  return <div className="detail-modal faculty-notes-modal"><div className="detail-modal-heading"><div><span className="eyebrow">FACULTY NOTES · {person.dept.toUpperCase()}</span><h2>{person.name}</h2><p>{person.subjects}</p></div></div><div className="notes-list">{notes.map((note) => <button className="faculty-note-row" key={note.title} onClick={() => openNote(note)}><span className={`note-file-type note-${note.fileType.toLowerCase()}`}>{note.fileType}</span><span className="faculty-note-copy"><strong>{note.title}</strong><small>{note.chapter} · {note.subject}</small><span>{note.description}</span><small>{note.fileName} · {note.uploadedAt} · {note.fileSize}</small></span><ArrowRight size={16} /></button>)}</div><div className="detail-note"><BookOpen size={16} /><div><strong>Mock learning materials</strong><p>These prototype files and contents are generated for demonstration and are not live college uploads.</p></div></div><div className="detail-modal-footer"><button className="outline-button" onClick={close}>Close notes</button></div></div>;
}

function FacultyNotePreviewModal({ person, note, close }) {
  if (!person || !note) return null;
  return <div className="detail-modal faculty-note-preview"><div className="detail-modal-heading"><div><span className="eyebrow">NOTE PREVIEW · {note.fileType}</span><h2>{note.title}</h2><p>{note.chapter} · {note.subject}</p></div></div><div className="note-preview-meta"><span><small>UPLOADED BY</small><strong>{person.name}</strong></span><span><small>UPLOADED</small><strong>{note.uploadedAt}</strong></span><span><small>FILE</small><strong>{note.fileName}</strong></span><span><small>SIZE</small><strong>{note.fileSize}</strong></span></div><article className="note-document"><div className="note-document-bar"><span>{note.fileType}</span><strong>{note.title}</strong></div><h3>{note.chapter}</h3>{note.content.split('\n').map((line, index) => line ? <p key={`${line}-${index}`}>{line}</p> : <br key={`blank-${index}`} />)}</article><div className="detail-note"><BookOpen size={16} /><div><strong>Prototype file</strong><p>Download creates a frontend-generated file using this note’s selected filename and file type.</p></div></div><div className="detail-modal-footer"><button className="outline-button" onClick={close}>Close preview</button><button className="primary-button" onClick={() => downloadFacultyNote(note)}>Download <ArrowDownRight size={14} /></button></div></div>;
}

function FacultyProfileModal({ person, close }) {
  if (!person) return null;
  const profile = facultyProfiles[person.name];
  return <div className="detail-modal faculty-profile-modal"><div className="detail-modal-heading faculty-profile-heading"><img src={`https://images.unsplash.com/${person.image}?w=240&h=240&fit=crop&crop=faces`} alt={person.name} /><div><span className="eyebrow">FACULTY PROFILE · {person.dept.toUpperCase()}</span><h2>{person.name}</h2><p>{person.role}</p><span className="dept-tag">{person.dept}</span></div></div><div className="detail-fact-grid"><div><small>OFFICE / CABIN</small><strong>{profile.office}</strong></div><div><small>STUDENT HOURS</small><strong>{profile.freeHours}</strong></div><div><small>EMAIL</small><a href={`mailto:${profile.email}`}>{profile.email}</a></div></div><section className="detail-section"><h3>Courses handled</h3><p>{profile.courses}</p><p><strong>Subjects:</strong> {person.subjects}</p></section><section className="detail-section"><h3>Education</h3><p>{profile.qualifications}</p></section><section className="detail-section"><h3>Expertise & interests</h3><p>{profile.expertise}</p></section><section className="detail-section"><h3>About</h3><p>{profile.bio}</p></section><section className="detail-note"><BookOpen size={16} /><div><strong>Faculty note</strong><p>{profile.notes}</p></div></section><div className="detail-modal-footer"><button className="outline-button" onClick={close}>Close profile</button><a className="primary-button" href={`mailto:${profile.email}`}>Email faculty <ArrowUpRight size={14} /></a></div></div>;
}

function DeadlineDetailsModal({ deadline, now, close }) {
  if (!deadline) return null;
  const urgency = deadlineUrgency(deadline, now);
  const related = deadline.id === 'assignment-submission' ? 'Computer Science · Data Structures' : deadline.id === 'exam-registration' ? 'Registrar’s office · End-term examinations' : deadline.id === 'scholarship-application' ? 'Student affairs · Financial aid' : 'Registrar’s office · Semester planning';
  const instructions = deadline.id === 'course-registration' ? 'Open the student portal, review your course selections, and submit before the deadline.' : deadline.id === 'assignment-submission' ? 'Upload the completed work to the course workspace and confirm that the submission receipt is visible.' : deadline.id === 'exam-registration' ? 'Review your examination schedule and confirm any required registration details.' : 'Complete the application form and attach all supporting documents before submitting.';
  return <div className="detail-modal deadline-detail-modal"><div className="detail-modal-heading"><div><span className="eyebrow">ACADEMIC DEADLINE · {urgency.toUpperCase()}</span><h2>{deadline.title}</h2><p>{related}</p></div></div><div className="detail-fact-grid"><div><small>DUE DATE</small><strong>{new Date(deadline.dueAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong></div><div><small>DUE TIME</small><strong>{new Date(deadline.dueAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</strong></div><div><small>STATUS</small><strong>{urgency}</strong></div><div><small>RELATED TO</small><strong>{related}</strong></div></div><section className="detail-section"><h3>What needs to be done</h3><p>{deadline.description}</p></section><section className="detail-section"><h3>Instructions</h3><p>{instructions}</p></section><section className="detail-note"><Clock3 size={16} /><div><strong>Keep an eye on this date</strong><p>CampusConnect updates this status from the current time while the app is open or loaded again.</p></div></section><div className="detail-modal-footer"><button className="primary-button" onClick={close}>Close deadline</button></div></div>;
}

function EventDetailsModal({ event, registered, setRegistered, close, notify }) {
  if (!event) return null;
  const details = eventProfiles[event.title];
  const isRegistered = registered.includes(event.title);
  return <div className="detail-modal event-detail-modal"><div className={`detail-event-image ${event.tone}`} style={{ backgroundImage: `url(https://images.unsplash.com/${event.image}?w=1200&h=520&fit=crop)` }}><span className="event-category-chip">{event.category}</span></div><span className="eyebrow">{event.month} {event.date} · {event.category.toUpperCase()}</span><h2>{event.title}</h2><p className="detail-lede">{details.description}</p><div className="detail-fact-grid"><div><small>DATE</small><strong>{event.month} {event.date}</strong></div><div><small>TIME</small><strong>{event.time}</strong></div><div><small>VENUE</small><strong>{event.venue}</strong></div><div><small>ORGANIZER</small><strong>{event.host}</strong></div></div><section className="detail-section"><h3>What to expect</h3><p>{details.expect}</p></section><section className="detail-section"><h3>Who can attend</h3><p>{details.eligibility}</p></section><section className="detail-fact-grid"><div><small>REGISTRATION DEADLINE</small><strong>{details.deadline}</strong></div><div><small>CAPACITY</small><strong>{details.capacity}</strong></div></section><section className="detail-section"><h3>What to bring</h3><p>{details.requirements}</p></section><section className="detail-section"><h3>Questions?</h3><a href={`mailto:${details.contact}`}>{details.contact}</a></section><div className="detail-modal-footer event-register-footer"><button className="outline-button" onClick={close}>Close details</button><button className="primary-button" disabled={isRegistered} onClick={() => { setRegistered((items) => items.includes(event.title) ? items : [...items, event.title]); notify(`Registration successful · ${event.title}`); }}>{isRegistered ? <><Check size={15} /> Registration successful</> : <>Register now <ArrowRight size={14} /></>}</button></div></div>;
}

function ClubDetailsModal({ club, joined, setJoined, applications, updateStatus, close, notify }) {
  if (!club) return null;
  const details = clubProfiles[club.name];
  const requestSent = joined.includes(club.name);
  const application = applications.find((item) => item.clubName === club.name);
  return <div className="detail-modal club-detail-modal"><div className="detail-modal-heading club-detail-heading"><span className={`club-emblem ${club.tint}`}>{club.icon}</span><div><span className="eyebrow">{club.category.toUpperCase()} · {club.members}</span><h2>{club.name}</h2><p>{club.about}</p></div></div><section className="detail-section"><h3>What the club does</h3><p>{club.about}</p><p>{club.activities}.</p></section><section className="detail-section"><h3>Activities, events & workshops</h3><p>{details.events}</p></section><section className="detail-section"><h3>Projects</h3><p>{details.projects}</p></section><div className="detail-fact-grid"><div><small>WHO CAN JOIN</small><strong>{details.who}</strong></div><div><small>EXPERIENCE / SKILLS</small><strong>{club.level} · {club.skills}</strong></div><div><small>TIME COMMITMENT</small><strong>{club.time}</strong></div><div><small>MEETING SCHEDULE</small><strong>{details.schedule}</strong></div><div><small>MEETING LOCATION</small><strong>{details.location}</strong></div><div><small>COORDINATOR</small><strong>{details.coordinator}</strong></div></div><section className="detail-section"><h3>Benefits & opportunities</h3><p>{club.benefits}. Participating can help build relevant skills and experience, but does not guarantee internships or placement outcomes.</p></section><section className="detail-section"><h3>Membership process</h3><p>{details.process}</p></section><section className="detail-section"><h3>Club guidelines</h3><p>{details.rules}</p></section><section className="detail-note"><Users size={16} /><div><strong>{requestSent ? `Request ${application.status.toLowerCase()}` : 'Membership status'}</strong><p>{requestSent ? `Your request to ${club.name} was submitted ${new Date(application.requestedAt).toLocaleDateString()}. The club coordinator will follow up with next steps.` : 'No membership request has been submitted yet.'}</p></div></section>{requestSent && <label className="club-status-demo"><span>MOCK COORDINATOR STATUS</span><select value={application.status} onChange={(event) => updateStatus(club.name, event.target.value)} aria-label="Mock application status"><option>Pending</option><option>Approved</option><option>Rejected</option></select><small>Simulates a local coordinator update.</small></label>}<div className="detail-modal-footer"><button className="outline-button" onClick={close}>Close details</button><button className="primary-button" disabled={requestSent} onClick={() => { setJoined((items) => items.includes(club.name) ? items : [...items, club.name]); notify(`Request sent to ${club.name}`); }}>{requestSent ? <><Check size={15} /> Request sent</> : <>Request to join <ArrowRight size={14} /></>}</button></div></div>;
}

function FacilityModal({ facility, close, notify }) {
  if (!facility) return null;
  const Icon = facility.icon;
  return <div className="facility-modal-content"><span className={`facility-icon ${facility.color}`}><Icon size={23} /></span><span className="eyebrow">{facility.type.toUpperCase()} · NORTHFIELD CAMPUS</span><h2>{facility.name}</h2><div className="facility-line"><MapPin size={15} />{facility.place}</div><div className="facility-line"><Clock3 size={15} />{facility.hours}</div><p>{facility.detail}</p><button className="primary-button full-button" onClick={() => { close(); notify(`Directions to ${facility.name} opened`); }}><Navigation size={15} /> Navigate here</button></div>;
}

export default App;
