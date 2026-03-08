/**
 * Challenge Seeding Script for Perennial Demo Database
 * This script populates the 'challenges' table with 63 challenges (42 Active + 21 Diversified), 
 * simulating user submissions through the service layer to ensure all business logic 
 * and validations (including financial accounting) are applied.
 */
import { PrismaClient, PlatformName, DurationType, CadenceUnit, ChallengeStatus } from '@prisma/client';
import * as challengeService from '../src/services/challengeService'; 
import logger from '../src/logger';

const prisma = new PrismaClient();

const challengeSeeds = [
  { 
    text: { 
      goal: "Master the Moeller 'whip' technique for effortless power.", 
      instructions: "Practice your Moeller strokes using alternating accents. Focus on the whip-like motion of the wrist and let the stick bounce naturally rather than gripping it tight. Your hand should feel like a wet towel being snapped. Focus on staying completely relaxed.", 
      references: [
        { type: "video", url: "https://www.youtube.com/watch?v=Zj3-Lc7UWwg", label: "Jojo Mayer: Moeller Stroke Lesson" },
        { type: "concept", url: "https://en.wikipedia.org/wiki/Moeller_method", label: "Moeller Method (Wikipedia)" }
      ],
      constraints: ["No rimshots allowed", "Must use matched grip"]
    }, 
    totalSessions: 21, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 21 days" 
  },
  { 
    text: { 
      goal: "Balance ghost notes and backbeats in a funk pocket.", 
      instructions: "Play a funk groove where your ghost notes are barely audible 'whispers' on the snare, while your backbeats stay crisp and loud. Use the 'tip' of the stick for ghosts and the 'shoulder' for backbeats. Record yourself to ensure the volume gap is wide enough.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/Clyde_Stubblefield", label: "Clyde Stubblefield (Wikipedia)" },
        { type: "song", url: "https://open.spotify.com/track/6M6v3Tid69FhO7z3", label: "The Funky Drummer - James Brown" }
      ],
      constraints: ["Metronome set to 90bpm", "No cymbals, hi-hat only"]
    }, 
    totalSessions: 14, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 14 days" 
  },
  { 
    text: { 
      goal: "Solidify your Jazz Swing Feel and Ride placement.", 
      instructions: "Play the standard 'spang-a-lang' jazz pattern. Keep the ride cymbal dancing and add occasional light snare comping. Try to 'feather' the bass drum on every quarter note so softly that it is felt rather than heard.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/Elvin_Jones", label: "Elvin Jones (Wikipedia)" },
        { type: "concept", url: "https://www.youtube.com/watch?v=PWBn7uuxSgk", label: "The Concept of Feathering" }
      ],
      constraints: ["Feathered kick drum mandatory", "Brushes or light sticks only"]
    }, 
    totalSessions: 10, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 10 days" 
  },
  { 
    text: { 
      goal: "Double Stroke Roll speed and consistency (32nd notes).", 
      instructions: "This is a stamina drill. Play continuous 32nd note double strokes for 30 seconds, then rest for 30 seconds. Use the 'Finger Control' method for the second stroke of each double. Start at 80bpm and increase by 5bpm every two minutes.", 
      references: [
        { type: "book", url: "https://example.com/stick-control", label: "Stick Control (Gladstone Technique)" },
        { type: "video", url: "https://youtube.com/finger-control-technique" }
      ],
      constraints: ["Must maintain 85bpm minimum", "Practice on a practice pad"]
    }, 
    totalSessions: 21, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 21 days" 
  },
  { 
    text: { 
      goal: "Clean double-tap kick patterns (Heel-Toe).", 
      instructions: "Focus on the 'snap' of the second stroke using the heel-toe technique. Practice rapid double hits on the kick drum. Make sure both hits in the double sound identical in volume and timing.", 
      references: [
        { type: "video", url: "https://youtube.com/heel-toe-technique" },
        { type: "concept", url: "https://example.com/lever-action-pedals", label: "Lever Action Mechanics" }
      ],
      constraints: ["Single pedal only", "Heel-up position"]
    }, 
    totalSessions: 15, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 15 days" 
  },
  { 
    text: { 
      goal: "Master the foundational 'alphabet' of drumming (N.A.R.D.).", 
      instructions: "Cycle through the standard rudiments as defined by the National Association of Rudimental Drummers. Focus on 'Open-to-Closed-to-Open' (Slow to Fast to Slow). Pay attention to your stick heights—they should be consistent.", 
      references: [
        { type: "other", url: "https://nard.us.com/N.A.R.D._Rudiments_files/NARD13Essential.pdf", label: "Official N.A.R.D. 13 Essential Rudiments PDF" }
      ],
      constraints: ["No metronome (Internal clock practice)"]
    }, 
    totalSessions: 21, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 21 days" 
  },
  { 
    text: { 
      goal: "Turn human speech patterns into a drum groove.", 
      instructions: "Listen to a podcast or a speech. Try to mirror the natural rhythm and 'cadence' of the speaker using your snare and toms. Don't worry about pitch, just the 'prosody' of the speech.", 
      references: [
        { type: "audio", url: "https://example.com/podcast-clip-rhythm" },
        { type: "concept", url: "https://example.com/prosody-percussion", label: "Prosody in Percussion" }
      ],
      constraints: ["Blindfolded (Focus on ears)", "Snare only"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Groove along to the rhythm of a news anchor.", 
      instructions: "Turn on a news broadcast. Use the steady, serious rhythm of the anchor's voice as your metronome and build a groove around it. The 'headline' is your snare rhythm, and the 'weather report' is your hi-hat pattern.", 
      references: [
        { type: "audio", url: "https://archive.org/broadcast-sample" }
      ],
      constraints: ["Must be a 4/4 time signature"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Use your drums to 'soundtrack' a silent movie scene.", 
      instructions: "Watch an old silent film clip. Match your drumming to the physical movements and slapstick timing of the actors on screen. Use different drums to represent different characters.", 
      references: [
        { type: "video", url: "https://archive.org/silent-films", label: "Silent Film Archive" },
        { type: "concept", url: "https://example.com/mickey-mousing", label: "Concept: Mickey Mousing" }
      ],
      constraints: ["No cymbals", "Continuous playing for 5 mins"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Improvise a soundtrack to changing natural environments.", 
      instructions: "Once a month, select a new nature soundscape (Rainfall, Thunderstorm, Ocean Waves, Forest Wind). Score the environment using appropriate dynamics—soft cymbal washes for rain, heavy toms for thunder.", 
      references: [
        { type: "playlist", url: "https://open.spotify.com/playlist/nature-sounds-reference", label: "Natural Sound Reference Playlist" }
      ],
      constraints: ["Use mallets or brushes only", "Minimum 10 minutes per session"]
    }, 
    totalSessions: 4, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.MONTHLY, cadenceText: "1 session per month for 4 months" 
  },
  { 
    text: { 
      goal: "Explore non-traditional sounds on your VAD module.", 
      instructions: "Switch to an industrial or electronic kit. Incorporate at least one 'found sound' or weird FX from the module into a 4/4 groove. This is inspired by industrial and experimental electronic music.", 
      references: [
        { type: "video", url: "https://youtube.com/roland-vad-sound-design", label: "Roland VAD Sound Design" }
      ],
      constraints: ["Must use at least 1 non-instrumental object"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Improve coordination by taking one limb away.", 
      instructions: "Play a complex groove, but intentionally 'mute' one limb (like your left foot) for 2 measures every 8, while the others keep going. This builds cognitive independence.", 
      references: [
        { type: "concept", url: "https://example.com/limb-independence" }
      ],
      constraints: ["Must maintain consistent hi-hat chick on beats 2 and 4 when not muted"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Play a rock beat against a Latin clave.", 
      instructions: "Keep a standard 4/4 rock beat with your hands while your left foot keeps a 3-2 son clave going on a cowbell sound. Keep the rock beat heavy and the clave steady.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/Horacio_Hernandez", label: "Horacio Hernandez (Wikipedia)" },
        { type: "book", url: "https://example.com/clave-patterns", label: "The Clave Bible" }
      ],
      constraints: ["Left foot cowbell required"]
    }, 
    totalSessions: 7, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 7 days" 
  },
  { 
    text: { 
      goal: "Balance your kit volume physically, not through tech.", 
      instructions: "Turn off all EQ and compression on your module. Balance the volume of your snare versus your cymbals purely through your physical touch. Record and listen back to check the mix.", 
      references: [
        { type: "concept", url: "https://example.com/internal-mixing" }
      ],
      constraints: ["No post-processing allowed"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Master the legendary half-time shuffle (Purdie Shuffle).", 
      instructions: "Focus on the 'bounce' of the ghost note triplets. It's all about that specific 'lazy' feel that Bernard Purdie is famous for. Listen to 'Home at Last' by Steely Dan for the reference pulse.", 
      references: [
        { type: "video", url: "https://youtube.com/purdie-shuffle" },
        { type: "song", url: "https://open.spotify.com/track/HomeAtLast", label: "Home At Last - Steely Dan" }
      ],
      constraints: ["Must use triplets", "Snare ghost notes required"]
    }, 
    totalSessions: 21, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 21 days" 
  },
  { 
    text: { 
      goal: "Make 7/8 feel as natural as 4/4.", 
      instructions: "Cycle a 7/8 groove (counting it as 2+2+3). Try to make it feel smooth enough that someone could dance to it. Avoid it feeling 'jagged.'", 
      references: [
        { type: "song", url: "https://open.spotify.com/track/money-pink-floyd", label: "Money - Pink Floyd" }
      ],
      constraints: ["No metronome for the final 5 minutes"]
    }, 
    totalSessions: 14, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 14 days" 
  },
  { 
    text: { 
      goal: "Make brush sweeps work on electronic drums.", 
      instructions: "Use the brush-specific settings on your module. Practice the sweeping motions and 'swirls' used in jazz ballads. Ensure the sensitivity is set correctly to pick up the friction.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/Jeff_Hamilton_(drummer)", label: "Jeff Hamilton (Wikipedia)" }
      ],
      constraints: ["Brushes only", "Tempo under 60bpm"]
    }, 
    totalSessions: 10, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 10 days" 
  },
  { 
    text: { 
      goal: "Play patterns where no two notes hit at once (Linear Gadd).", 
      instructions: "Play patterns where the hands and feet follow each other in a line (no simultaneous hits). Practice the K-R-L-K-R-L-R-L pattern. This creates that 'winding' Steve Gadd sound.", 
      references: [
        { type: "video", url: "https://youtube.com/gadd-linear" },
        { type: "song", url: "https://open.spotify.com/track/fifty-ways-leave-lover", label: "50 Ways to Leave Your Lover - Steve Gadd" }
      ],
      constraints: ["No unison hits allowed"]
    }, 
    totalSessions: 14, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 14 days" 
  },
  { 
    text: { 
      goal: "Build independence with 3-against-4 polyrhythms.", 
      instructions: "Play a steady 4/4 pulse on your kick and snare while your hi-hat (or ride) plays in 3/4. Don't let the counts pull each other off beat. This is a classic brain-splitter.", 
      references: [
        { type: "concept", url: "https://example.com/polyrhythm-math", label: "The Math of 4:3" }
      ],
      constraints: ["Kick/Snare must stay on the grid"]
    }, 
    totalSessions: 21, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 21 days" 
  },
  { 
    text: { 
      goal: "Build endurance for high-velocity metal drumming.", 
      instructions: "Practice fast, alternating hits between your kick and snare. Focus on staying relaxed so you don't tense up and slow down. Start at 120bpm and aim for stability over speed.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/George_Kollias", label: "George Kollias (Wikipedia)" }
      ],
      constraints: ["Traditional grip for snare hand optional"]
    }, 
    totalSessions: 21, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 21 days" 
  },
  { 
    text: { 
      goal: "Master the 'empty' first beat of reggae (One-Drop).", 
      instructions: "In this style, the kick drum only hits on the 3rd beat. Keep the hi-hats eighth notes steady and the rim-click crisp. Use a cross-stick on the snare for that authentic woody sound.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/Carlton_Barrett", label: "Carlton Barrett (Wikipedia)" },
        { type: "song", url: "https://open.spotify.com/track/one-drop-bob-marley", label: "One Drop - Bob Marley" }
      ],
      constraints: ["Kick only on beat 3", "Cross-stick snare only"]
    }, 
    totalSessions: 7, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 7 days" 
  },
  { 
    text: { 
      goal: "Keep a steady 'baion' foot pattern (Bossa Nova).", 
      instructions: "Keep your feet playing a constant '1... (and) 2' pattern (dotted 8th, 16th) while your hands play syncopated rim-clicks. It requires perfect timing between feet and hands.", 
      references: [
        { type: "song", url: "https://open.spotify.com/track/girl-from-ipanema", label: "The Girl From Ipanema" }
      ],
      constraints: ["Consistent ride cymbal mandatory"]
    }, 
    totalSessions: 14, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 14 days" 
  },
  { 
    text: { 
      goal: "Create a 'wall of sound' cinematic swell.", 
      instructions: "Use soft mallets to create smooth, atmospheric swells on your cymbals. Build the volume from a whisper to a roar gradually. Focus on the 'wash' of the sound.", 
      references: [
        { type: "concept", url: "https://example.com/mallet-swells", label: "Cymbal Swell Techniques" }
      ],
      constraints: ["Mallets only", "Minimum 30s crescendo"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Master the powerful R-L-K triplet pattern (Bonham).", 
      instructions: "Practice the 'galloping' triplet (Right Hand, Left Hand, Kick). Focus on power and making the transition from hands to feet seamless. Speed it up until it sounds like a single instrument.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/John_Bonham", label: "John Bonham (Wikipedia)" },
        { type: "video", url: "https://youtube.com/bonham-triplets" }
      ],
      constraints: ["Must maintain consistent volume across hands and feet"]
    }, 
    totalSessions: 10, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 10 days" 
  },
  { 
    text: { 
      goal: "Test your timing by shifting the 'click'.", 
      instructions: "Set your metronome to a steady pulse, but treat the click as the 'and' (the upbeat). Your goal is to keep a groove where your main beats land in the silences. This will feel like the metronome is fighting you.", 
      references: [
        { type: "concept", url: "https://example.com/internal-clock-theory" }
      ],
      constraints: ["Start at 60bpm", "Record and check if you 'flipped' back"]
    }, 
    totalSessions: 5, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "1 session per day for 5 days" 
  },
  { 
    text: { 
      goal: "Master the fast hi-hat 'zips' (Trap Rolls).", 
      instructions: "Practice 16th and 32nd note triplets on the hi-hat using one hand. Use your fingers to get that rapid-fire speed. Incorporate bursts and rolls found in trap music.", 
      references: [
        { type: "song", url: "https://open.spotify.com/playlist/trap-drums-reference", label: "Trap Drums Reference" }
      ],
      constraints: ["Single hand for hi-hat only"]
    }, 
    totalSessions: 10, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "10 days of hats" 
  },
  { 
    text: { 
      goal: "Build a catchy groove without using snare or cymbals.", 
      instructions: "Switch to a tom-heavy kit. You aren't allowed to use the snare—create the entire groove using just the toms and the kick. Use the toms as melodic voices.", 
      references: [
        { type: "video", url: "https://youtube.com/tribal-tom-grooves", label: "Tribal Drumming Concepts" }
      ],
      constraints: ["Absolutely no snare drum", "No cymbals"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Fluidly blend visual flair with consistent timing.", 
      instructions: "Practice backsticking, twirls, or crossovers while maintaining a simple 2 and 4 backbeat. The trick must not interrupt the groove or tempo. Rotate through different tricks each session.", 
      references: [
        { type: "video", url: "https://www.youtube.com/watch?v=MkK8qACn6xs", label: "7 Favorite Drum Stick Tricks" }
      ],
      constraints: ["Must maintain consistent 2/4 backbeat"]
    }, 
    totalSessions: 12, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.WEEKLY, cadenceText: "3 sessions per week for 4 weeks" 
  },
  { 
    text: { 
      goal: "Use the R-L-R-R-L-L rudiment in a drum fill.", 
      instructions: "Practice the paradiddle-diddle moving across the toms. It’s a great way to move quickly without crossing your arms. Focus on even stick heights and making it sound fluid.", 
      references: [
        { type: "other", url: "https://example.com/paradiddle-diddle-notation" }
      ],
      constraints: ["Focus on even stick heights"]
    }, 
    totalSessions: 14, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "14 days of fills" 
  },
  { 
    text: { 
      goal: "Master the 'heavy' funk pocket (Half-Time).", 
      instructions: "Play a funk groove but drop the snare backbeat to the '3.' Focus on making it feel deep and groovy. This creates a massive amount of 'air' in the beat.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/Questlove", label: "Questlove (Wikipedia)" }
      ],
      constraints: ["Slightly behind the beat (laid back)"]
    }, 
    totalSessions: 7, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "7 days of funk" 
  },
  { 
    text: { 
      goal: "Build sprinting speed with your feet.", 
      instructions: "Set a timer for 1 minute and play steady 16th notes on the double kick. Focus on keeping both feet sounding identical. If you break rhythm, stop and restart.", 
      references: [
        { type: "concept", url: "https://example.com/muscle-fatigue-management" }
      ],
      constraints: ["Must maintain for 60 seconds without stopping"]
    }, 
    totalSessions: 21, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "21 days of double kick" 
  },
  { 
    text: { 
      goal: "Practice locking in with a bassist.", 
      instructions: "Find a 'bass only' track. Make sure every single time the bassist hits a note, your kick drum is hitting exactly with them. Do not play any extra kick notes.", 
      references: [
        { type: "song", url: "https://open.spotify.com/track/flea-bass-line" }
      ],
      constraints: ["No extra kick notes allowed"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Play with the perfect timing of a machine.", 
      instructions: "Use a dry, clicky kit. Focus on being so 'on the grid' that your hits perfectly overlap with the metronome. This is the opposite of micro-rhythm—it is pure metronomic precision.", 
      references: [
        { type: "concept", url: "https://example.com/industrial-precision" }
      ],
      constraints: ["Must be perfectly on the grid"]
    }, 
    totalSessions: 7, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "7 days of precision" 
  },
  { 
    text: { 
      goal: "Maintain energy and speed at a tiny volume (Whisper Metal).", 
      instructions: "Play an aggressive heavy metal groove (blasts, double kick) as quietly as possible. Maintain the speed, but keep the volume at a 'whisper.' This forces efficiency of motion.", 
      references: [
        { type: "concept", url: "https://example.com/pianissimo-control" }
      ],
      constraints: ["Sticks must not rise above 2 inches"]
    }, 
    totalSessions: 14, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "14 days of control" 
  },
  { 
    text: { 
      goal: "Build the habit of non-stop creative play.", 
      instructions: "Play for 21 minutes without stopping. Don't judge what you play; just keep the flow moving. If you run out of ideas, play a simple beat until a new idea comes.", 
      references: [
        { type: "audio", url: "https://example.com/flow-state-guided-meditation" }
      ],
      constraints: ["No stopping, no metronome"]
    }, 
    totalSessions: 8, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.CUSTOM_DAYS, cadenceText: "2 sessions every 3 days then repeat this 4 times." 
  },
  { 
    text: { 
      goal: "Add busy-ness to a beat using quiet taps (Syncopation).", 
      instructions: "Play a 16th note linear pattern where the snare ghost notes only occur on the 'e' and 'a' of the beat. This creates a complex, rolling texture.", 
      references: [
        { type: "video", url: "https://youtube.com/ghost-note-masterclass" }
      ],
      constraints: ["Main backbeat must stay consistent"]
    }, 
    totalSessions: 7, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "7 days of ghost notes" 
  },
  { 
    text: { 
      goal: "Practice quick foot sprints for metal (Double Kick).", 
      instructions: "Play 5-second bursts of maximum speed 16th notes on the kick, then 5 seconds of rest. Repeat for the session. This builds 'fast twitch' muscle response.", 
      references: [
        { type: "concept", url: "https://example.com/fast-twitch-activation" }
      ],
      constraints: ["Maximum speed during bursts"]
    }, 
    totalSessions: 21, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "21 days of sprints" 
  },
  { 
    text: { 
      goal: "Match the 'length' of the notes with a bassist.", 
      instructions: "Listen to a bass track. Short bass notes = short kick drum hits. Long bass notes = open cymbal hits. You are mimicking the 'sustain' of a melodic instrument.", 
      references: [
        { type: "concept", url: "https://example.com/musical-sustain" }
      ],
      constraints: ["Must use at least 2 different types of cymbal sustain"]
    }, 
    totalSessions: 1, durationType: DurationType.ONE_OFF, cadenceUnit: null, cadenceText: "ONE_OFF: 1 session(s)." 
  },
  { 
    text: { 
      goal: "Make your hands and feet sound like one engine.", 
      instructions: "Focus on the 'unison' of your hits. Your kick and snare should hit at the exact same time so they sound like one powerful instrument. Eliminate all 'flams' between limbs.", 
      references: [
        { type: "concept", url: "https://example.com/vertical-alignment" }
      ],
      constraints: ["Record and listen for unison accuracy"]
    }, 
    totalSessions: 7, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "7 days of unison" 
  },
  { 
    text: { 
      goal: "Build speed using fingers by limiting stick height.", 
      instructions: "Play a fast metal groove but don't let your sticks go more than an inch off the drum. This relies entirely on finger control and wrist snap rather than arm movement.", 
      references: [
        { type: "musician", url: "https://en.wikipedia.org/wiki/Derek_Roddy", label: "Derek Redy (Wikipedia)" }
      ],
      constraints: ["No arm movement allowed"]
    }, 
    totalSessions: 14, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "14 days of stealth speed" 
  },
  { 
    text: { 
      goal: "Master high-tempo breakbeats and smooth ghost notes.", 
      instructions: "Progress from the foundational 'Amen Break' to atmospheric, flowing grooves with snare hits that 'dance' around the main beat. Aim for high speed (175bpm+) endurance.", 
      references: [
        { type: "song", url: "https://open.spotify.com/track/amen-break-original", label: "The Amen Break" },
        { type: "concept", url: "https://example.com/dnb-mechanics", label: "D&B Breakbeat Mechanics" }
      ],
      constraints: ["Tempo must stay above 165bpm"]
    }, 
    totalSessions: 12, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.WEEKLY, cadenceText: "3 sessions per week for 4 weeks" 
  },
  { 
    text: { 
      goal: "Mastering Micro-Timing and Rhythmic Nuance.", 
      instructions: "Go beyond the rigid grid of western notation by exploring micro-rhythms—intentional deviations and subtleties that notation cannot accurately represent. \n\n- **Phase 1 (Sessions 1-3)**: Develop 'The Grid vs. The Feel'. Practice playing 'behind' and 'ahead' of a high-pitched cowbell click. Focus on the consistent space between the click and your strike. \n- **Phase 2 (Sessions 4-6)**: Study the 'Unquantized Swing'. Play along to classic tracks by J Dilla or D'Angelo (e.g., 'Untitled'). Focus on the 'late' snare and 'drunken' kick placement that creates a human pocket. \n- **Phase 3 (Session 7)**: Modern Lofi Application. Drum along to a lofi hip-hop stream. Incorporate everything learned to create a laid-back, personal 'feel' that flows with the unquantized samples.", 
      references: [
        { type: "concept", url: "https://www.confidentdrummer.com/what-are-micro-rhythms-and-micro-timing-and-why-they-matter", label: "Article: What Are Micro-Rhythms and Micro-Timing?" },
        { type: "video", url: "https://www.youtube.com/@LofiGirl", label: "Lofi Girl", details: "Modern Micro-Timing Examples" },
        { type: "musician", url: "https://en.wikipedia.org/wiki/J_Dilla", label: "J Dilla" }
      ],
      constraints: ["Use a high-pitch cowbell click for Phase 1", "Record sessions and compare the 'offset' of each hit"]
    }, 
    totalSessions: 7, durationType: DurationType.RECURRING, cadenceUnit: CadenceUnit.DAILY, cadenceText: "7 days" 
  }
];

export async function main() {
  logger.info('🌱 SEED: Starting FULL Challenge Seeding (63 Challenges)...');

  // 1. Fetch available users restricted to IDs 2 to 20
  const users = await prisma.user.findMany({
    where: { id: { gte: 2, lte: 20 } },
    include: { perennialTokens: true }
  });

  if (users.length === 0) {
    logger.error('❌ No bots (ID 2-20) found. Please run user seed first.');
    return;
  }

  // Combine original 42 seeds with 21 diversified seeds
  const diversifiedSeeds = Array.from({ length: 21 }).map((_, i) => ({
    ...challengeSeeds[i % challengeSeeds.length],
    text: { 
      ...challengeSeeds[i % challengeSeeds.length].text, 
      goal: `[DIVERSIFIED] ${challengeSeeds[i % challengeSeeds.length].text.goal}` 
    }
  }));

  const allSeeds = [...challengeSeeds, ...diversifiedSeeds];
  let seedIndex = 0;

  for (const user of users) {
    const token = user.perennialTokens[0];
    if (!token) continue;

    const submissionsPerUser = Math.ceil(allSeeds.length / users.length);

    for (let i = 0; i < submissionsPerUser; i++) {
      if (seedIndex >= allSeeds.length) break;

      const seed = allSeeds[seedIndex];
      const isOriginal42 = seedIndex < 42;
      
      try {
        // Correcting result access from 'updatedChallenge' to 'newChallenge'
        const result = await challengeService.processChallengeSubmission(
          user.id,
          token.platformId,
          token.platformName as PlatformName,
          seed.text,
          seed.totalSessions,
          seed.durationType,
          seed.cadenceText || undefined,
          seed.cadenceUnit || undefined
        );

        const cId = result.newChallenge.challengeId;
        const daysSinceActivation = Math.floor(Math.random() * 21);

        // Explicitly type status as ChallengeStatus to avoid TS2322
        let finalStatus: ChallengeStatus = ChallengeStatus.ACTIVE;
        let completionDate: Date | null = null;

        if (!isOriginal42) {
          const roll = Math.random();
          if (roll > 0.6) {
            finalStatus = ChallengeStatus.COMPLETED;
            completionDate = new Date();
          } else if (roll > 0.4) {
            finalStatus = ChallengeStatus.FAILED;
          } else if (roll > 0.2) {
            finalStatus = ChallengeStatus.ARCHIVED;
          } else {
            finalStatus = ChallengeStatus.IN_PROGRESS;
          }
        }

        await prisma.challenge.update({
          where: { challengeId: cId },
          data: {
            status: finalStatus,
            streamDaysSinceActivation: daysSinceActivation,
            timestampCompleted: completionDate
          }
        });

        seedIndex++;
      } catch (error) {
        logger.error(`❌ Submission failed for user ${user.id}:`, error);
      }
    }
  }

  const finalCount = await prisma.challenge.count();
  logger.info(`✅ SEED COMPLETE: ${finalCount} Challenges Created.`);
}