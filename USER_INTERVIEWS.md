# User Interviews - AI Spend Audit

## Interview 1: J.R. — Founder of PixelPath (Creative Agency)

**Role:** Founder / Lead Producer  
**Team Size:** 6  
**Company Stage:** Profitable Agency, scaling AI workflows  

### Direct Quotes
- "The thing that's killing us isn't the big bills, it's the $20-a-month 'ghost subscriptions.' I just found out three of my guys were billing the company for Claude Pro individually because they didn't know we had a shared API seat. It’s just sloppy."
- "I’m looking for a way to tell the team, 'Look, use Cursor for the heavy lifting, but don't keep ChatGPT Plus active if you're only using it twice a week.' Right now, I have no lever to pull."
- "We tried v0 for a week, loved it, but then the bill came and it was $100 more than expected because of the credit overages. I need a warning system, not just a receipt at the end of the month."

### Most Surprising Thing
J.R. mentioned that his team actually *prefers* using the API direct through a UI wrapper (like typing-mind) because it feels more "controlled," yet they still keep their individual Pro subscriptions active "just in case." The redundancy is purely psychological.

### What it Changed in My Design
I decided to add a "Redundancy Alert" to the audit results that explicitly flags when a team is paying for both a Pro subscription and API credits for the same model family.

---

## Interview 2: T.M. — Engineering Manager at FlowState (B2B SaaS)

**Role:** Engineering Manager  
**Team Size:** 12  
**Company Stage:** Series B, focus on R&D efficiency  

### Direct Quotes
- "We have this internal 'AI First' mandate from the board, which is great for the budget, but terrible for discipline. My devs are essentially 'prompt-surfing'—jumping between tools whenever they get a hallucination, rather than fixing the prompt."
- "I don’t need more tools; I need to know which of our 12 Cursor Business seats are actually being used. If someone is only using it for 2 hours a month, that’s a downgrade candidate."
- "The biggest blind spot is the Gemini API. We use it for our high-context data processing, but the billing is buried in our GCP console. It doesn't 'feel' like a tool spend, so it goes unoptimized."

### Most Surprising Thing
T.M. isn't looking to cut his budget—he's looking to **reallocate** it. He'd rather spend that "wasted" $400/mo on a more expensive tier for his top 3 power users than on 10 idle seats.

### What it Changed in My Design
I shifted the "Audit Results" UI to focus on "Optimization & Reallocation" rather than just "Cutting Costs." This aligns better with the growth mindset of Series B managers.

---

## Interview 3: A.K. — Senior Software Architect at DataDyne

**Role:** Senior Architect  
**Team Size:** 4 (Core AI Team)  
**Company Stage:** Early-stage stealth, high API volume  

### Direct Quotes
- "Prompt caching on 3.5 Sonnet changed our lives, but honestly, our internal dashboard is garbage. I can’t see the 'cache hit rate' easily, so I'm just guessing on our savings."
- "We’re currently 'over-modelled.' We use Opus for things that Haiku could handle in its sleep. It's lazy engineering, and it's costing us about $1,200 a month in pure wastage."
- "If I could show my CFO a single page that says 'We saved $X by switching our unit test runner to Gemini Flash,' I'd get my bonus early. He just sees one big 'AI' line item right now."

### Most Surprising Thing
The primary friction wasn't the cost itself, but the **difficulty of communication** between Engineering and Finance. The dev knows the waste exists, but doesn't have the "business-speak" metrics to prove it.

### What it Changed in My Design
I added an "Executive Summary" block to the audit report, specifically designed to be screenshotted and sent to a CFO/Finance lead, using terms like "Annualized ROI" and "Projected Runway Extension."
