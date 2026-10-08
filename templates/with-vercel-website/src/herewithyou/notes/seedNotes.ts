import type { Note } from './types'

const seedCreatedAt = '2026-01-01T00:00:00.000Z'

const seedBodies: string[] = [
  `Hey stranger,

I don't know what you're carrying today. But I've had stretches of my life where getting through the day felt like an accomplishment nobody else could see.

So if that's where you are right now, I just wanted somebody to acknowledge it.

I'm rooting for you.

— A stranger`,

  `My dad died in March. For a long time I hated when people told me it would get easier, because it didn't, not for a while. What happened instead is that I got a little stronger at carrying it.

Some days are still bad. But there are good ones mixed in now, and I didn't believe that would ever be true.

If you're early in it: eat something today. That counts.`,

  `Whatever happened today, you don't have to make sense of it tonight. Go to sleep. Tomorrow is allowed to be different.`,

  `Day one again? I had about eleven of those.

Nobody gets a medal for the number of times they start over, but I think they should. I'm at four years now and I still remember how embarrassed I felt walking back into that room. Nobody there cared that I'd left. They were just glad I came back.

Go back.`,

  `hi. i moved to a city where i didn't know anyone when i was 29 and spent most weekends talking to no one except the guy at the coffee place. i used to think something was wrong with me. there wasn't.

it took about two years but i have people now. people who'd notice if i went quiet. you're not unlovable, you're just early.`,

  `I know you keep checking your phone. I did that too. For months.

It's not weakness, it's just what a heart does when it's used to someone. It will stop eventually. One day you'll realize you went a whole afternoon without thinking about them, and you'll feel strange and a little sad about that, and then you'll feel free.`,

  `I failed the bar exam twice. The second time I sat in my car in the parking garage for an hour because I couldn't face telling my mom.

I passed the third time. Nobody I work with now knows any of that, or would care.

Whatever you failed at, it's information. It isn't a verdict.`,

  `Some days are just bad. Not tragic, not meaningful, just bad. The toast burns and the email is rude and you end up crying in a bathroom stall over something small.

If that's today, I'm sorry. It was a lot. Be easy on yourself tonight.`,

  `I don't know what's going to happen to you. Nobody does, which is annoying when you want someone to promise it'll be okay.

What I can tell you is that I've been somewhere I couldn't see more than a day ahead. I kept going a day at a time, and eventually the fog lifted enough that I could see where I was. It took longer than I wanted. It usually does.`,

  `I started over at 52. Divorced, new apartment, mattress on the floor, a job I was overqualified for. I felt ridiculous. My kids helped me carry boxes up three flights and I could hardly look at them.

That was six years ago. I have a real bed now, and tomatoes on the balcony, and a life that's actually mine.

It isn't too late for you either. I know it feels like it is.`,

  `When my dog died, people were kind for about a day and then expected me to be fine. I wasn't fine for a long time.

If you're grieving something other people think is small, it isn't small.`,

  `I don't have anything wise to say. I just wanted you to know that somebody, somewhere, thought about you today and hoped you were okay.`,

  `I spent three years taking care of my mother while she slowly forgot who I was. Nobody throws you a party for that. Most people don't even ask.

So if you're doing something hard that nobody sees: I see it. You're doing better than you think you are.`,

  `Took my meds, drank some water, sat outside for ten minutes. That was the whole day once.

It was enough. Yours can be too.`,

  `Got laid off by email at 7:40 in the morning. Twelve years. I remember standing in the kitchen not knowing what to do with my hands.

Here's what I wish someone had told me: your job was a thing you did, not the thing you are. It took me a long while to believe that. I hope you get there faster than I did.`,

  `We lost a pregnancy two years ago. I didn't tell most people, so most people never knew why I was so quiet that summer.

If you're carrying something like that by yourself, I'm so sorry. You're allowed to grieve someone the world never got to meet.`,

  `honestly high school was the worst four years of my life and i'm 26 now and it's so much better. like not even close. the people who made you feel small won't matter at all in a few years. hang on.`,

  `If you're reading this at 3am: hi.

The thoughts are always louder at this hour. A lot of what feels true right now will look different in daylight. Put the phone down soon if you can.

I'll be rooting for you in the morning.`,

  `I left my country at 24, and for the first year I cried almost every time I called home. My English wasn't good yet and I felt stupid all the time, even though I wasn't.

Being far from everyone who knows you is its own kind of grief. It gets lighter. You'll build something here. Give it time.

— someone who still misses home, but is okay`,

  `Hey. Rough one? Same, some years.

Drink a glass of water. Text one person back. That's the whole assignment for today.`,

  `I haven't spoken to my brother in five years. Some days I'm at peace with it and some days I'm really not.

If you're grieving someone who's still alive, that's a real loss too. It's confusing. You don't have to have it figured out.`,
]

// Assign seed bodies to topics: [body index, topic]
const seedAssignments: Array<[number, string]> = [
  [1, 'grief'], // My dad died
  [3, 'sobriety'], // Day one again
  [5, 'heartbreak'], // Checking your phone
  [4, 'loneliness'], // Moved to city
  [9, 'starting_over'], // Started over at 52
  [10, 'grief'], // Dog died
  [14, 'starting_over'], // Laid off
  [18, 'loneliness'], // Left country
]

export const seedNotes: Note[] = seedAssignments.map(([bodyIndex, topic], seedIndex) => ({
  id: `seed-${seedIndex + 1}`,
  body: seedBodies[bodyIndex],
  createdAt: seedCreatedAt,
  source: 'seed',
  topic,
}))
