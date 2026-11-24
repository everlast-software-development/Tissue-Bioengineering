import { Article } from '@/types';

/**
 * Article text is the original wording supplied by the clinic: do not shorten, reword or add
 * claims. `**bold**` keeps the original emphasis. Author and date are left out until supplied.
 */
/** The "Burn Treatment Timeline" diagram: the burns article's cover and its figure under "Ideal Timing". */
const burnTimelineAlt =
  'Timeline titled “Burn Treatment Timeline” with four stages: Superficial Burn Treatment, initiate treatment shortly after the burn; Moderate Burn Treatment, begin treatment within two weeks post-burn; Bio-tissue Engineering, apply to older burn scars for improvement; AI and 3D Imaging, utilize for customized treatment plans';

export const articles: Article[] = [
  {
    id: 'dfu-svf',
    slug: 'why-diabetic-foot-ulcers-deserve-serious-attention',
    title: 'Why Diabetic Foot Ulcers Deserve Serious Attention',
    category: 'Regenerative Medicine',
    summary:
      'At Everlast Wellness Medical Center in Abu Dhabi, the Tissue Bioengineering Division is pioneering regenerative therapies to treat diabetic foot ulcers. Their approach uses stromal vascular fraction (SVF) derived from fat tissue to stimulate healing and enhance blood flow.',
    coverImage: '/images/diabetic-foot-ulcer.webp',
    coverImageWidth: 1024,
    coverImageHeight: 683,
    coverImageAlt:
      'A bare foot with purple and reddish discolouration across the top of the foot and toes, resting on a wooden floor',
    tags: [],
    body: [
      {
        type: 'note',
        text: 'Based on Dr. Christeen’s speech at the 16th Abu Dhabi Wound Care Conference (ADWCC) 2025, organized by the IWCG.',
      },
      // The first section's heading is the article title (the page's h1).
      {
        type: 'paragraph',
        text: '**Diabetic foot ulcers** are among the most serious complications for people with diabetes. These wounds are slow to heal due to poor blood flow and nerve damage, making them prone to infection, long hospital stays, and, in severe cases, amputation. Traditional treatments—like dressings, antibiotics, and debridement—often do not heal these ulcers quickly or completely, especially in chronic cases',
      },

      { type: 'heading', text: 'What Is SVF (Stromal Vascular Fraction)?' },
      {
        type: 'paragraph',
        text: 'Stromal Vascular Fraction (SVF) is a mixture of regenerative cells taken from a patient’s own fat tissue. SVF contains:',
      },
      {
        type: 'image',
        src: '/images/svf-cell-types.webp',
        alt: 'Diagram titled “Types of Cells” showing three cell types: stem cells, blood vessel-forming cells and immune-supportive cells',
        width: 720,
        height: 312,
        caption: 'Types of cells in SVF',
      },
      {
        type: 'paragraph',
        text: 'The collection and injection process is quick and minimally invasive. **SVF** is usually injected around the wound site to support healing.',
      },

      { type: 'heading', text: 'How SVF Heals Diabetic Foot Ulcers' },
      { type: 'paragraph', text: '**SVF** works in several ways to encourage wound healing:' },
      {
        type: 'list',
        items: [
          '**Promotes New Blood Vessels**: **SVF** stimulates angiogenesis (formation of new blood vessels), improving circulation to the wound, a critical factor for healing in **diabetic patients**',
          '**Reduces Inflammation**: SVF contains immune cells that help reduce chronic inflammation, creating a better environment for healing',
          '**Regenerates Tissue**: SVF activates skin cells, increases collagen production, and supports tissue regeneration, helping wounds close faster and stronger',
          '**Enhances Oxygen and Nutrient Delivery**: Improved blood flow means better oxygen and nutrient delivery, which is essential for tissue repair',
        ],
      },

      { type: 'heading', text: 'Clinical Evidence: What the Research Says' },
      {
        type: 'paragraph',
        text: 'A major clinical study involving **63 patients** with chronic, non-healing diabetic foot ulcers (all at risk of amputation) found that:',
      },
      {
        type: 'list',
        items: [
          '**51 patients** achieved full wound closure within **6 months**.',
          '8 more had at least **75%** improvement.',
          '**After one year**, 50 maintained complete healing, and 4 showed over **85%** closure.',
          'No serious side effects were reported, even in patients with **large ulcers**.',
          'Doppler ultrasound confirmed improved blood flow in treated areas.',
          'Even wounds over **10 cm²** responded positively, showing that SVF works for various ulcer sizes.',
        ],
      },
      {
        type: 'image',
        src: '/images/diabetic-foot-ulcer-healing-timeline.webp',
        alt: 'Timeline titled “Healing Journey of Diabetic Foot Ulcers”: at 6 months, 51 patients achieved full wound closure and 8 more had at least 75% improvement; at 1 year, 50 maintained complete healing and 4 showed over 85% closure',
        width: 720,
        height: 552,
        caption: 'Healing journey of diabetic foot ulcers',
      },
      {
        type: 'paragraph',
        text: 'These results indicate that **SVF** can be safely used to treat chronic diabetic foot ulcers, with evidence of efficacy and mechanisms of action that include vascular repair and angiogenesis',
      },

      { type: 'heading', text: 'Why SVF Is a Game-Changer?' },
      {
        type: 'list',
        items: [
          'Minimally Invasive: Uses the patient’s fat-derived cells, no surgery or artificial implants',
          'Time-Efficient: SVF can be collected and injected in a single outpatient visit',
          'Safe and Practical: Suitable for resource-limited settings; does not require hospitalization',
          'Targets the Root Cause: SVF improves circulation and promotes regeneration, not just symptom relief',
        ],
      },

      { type: 'heading', text: 'Key Takeaways for Patients and Caregivers' },
      {
        type: 'list',
        items: [
          'SVF therapy is a safe and effective option for chronic, non-healing diabetic foot ulcers',
          'It significantly increases healing rates and may help avoid amputation',
          'SVF therapy is showing potential to become a new standard in diabetic foot care worldwide',
        ],
      },

      { type: 'heading', text: 'Frequently Asked Questions (FAQ)' },
      {
        type: 'faq',
        items: [
          {
            question: 'What is SVF, and how is it collected?',
            answer:
              'SVF is a blend of healing cells taken from a small amount of the patient’s fat. The fat is processed, and the SVF is reinjected around the wound to support healing.',
          },
          {
            question: 'Is SVF therapy safe?',
            answer:
              'Yes. Clinical studies show SVF therapy is generally safe, with no serious side effects reported. Minor discomfort or swelling may occur at the injection site.',
          },
          {
            question: 'How does SVF compare to traditional treatments?',
            answer:
              'SVF leads to faster and more complete healing, especially in patients who haven’t responded to standard therapies',
          },
          {
            question: 'Who is a candidate for SVF therapy?',
            answer:
              'Patients with chronic or non-healing diabetic foot ulcers, especially those at risk of amputation, may benefit. Medical consultation is needed to confirm suitability.',
          },
          {
            question: 'How is SVF administered for diabetic foot ulcers?',
            answer:
              'SVF is injected around the wound and sometimes along the arteries of the foot to promote healing and improve blood flow',
          },
          {
            question: 'Are there any risks or side effects with SVF therapy?',
            answer:
              'No major side effects have been reported in clinical studies. Minor risks, such as infection or discomfort at the injection site, are possible but rare.',
          },
          {
            question: 'Can SVF therapy prevent amputation in diabetic foot patients?',
            answer:
              'Yes, studies suggest that SVF therapy can help prevent limb loss by promoting healing in wounds that would otherwise require amputation',
          },
        ],
      },

      { type: 'heading', text: 'A New Era in Diabetic Wound Healing' },
      {
        type: 'paragraph',
        text: 'SVF therapy offers new hope to patients with diabetic foot ulcers. It is safe, minimally invasive, and backed by scientific evidence. As more clinics adopt this approach, SVF may soon become a standard treatment, helping more people heal and avoid amputation.',
      },
    ],
  },
  {
    id: 'burn-scar-free-healing',
    slug: 'dr-christeen-sabah-al-emarat-scar-free-burn-healing',
    title: 'Dr. Christeen on “Sabah Al Emarat”: Revolutionary Scar-Free Burn Healing',
    category: 'Regenerative Medicine',
    summary:
      'At Everlast Wellness Medical Center in Abu Dhabi, the Tissue Bioengineering Division is revolutionizing burn treatment by scar-free regenerative healing. Spearheaded by Dr. Christeen Youssef,  a groundbreaking protocol blends autologous stem cell therapy to restore damaged skin .',
    // Chosen by the clinic (the original's visual-selection-11.webp); also the figure under "Ideal Timing".
    coverImage: '/images/burn-treatment-timeline.webp',
    coverImageWidth: 816,
    coverImageHeight: 696,
    coverImageAlt: burnTimelineAlt,
    coverImageFit: 'contain',
    tags: [],
    body: [
      {
        type: 'paragraph',
        text: 'Dr. Christeen, owner of Everlast Wellness Medical Center, recently shared a groundbreaking advancement in burn scar treatment on the “Sabah Al Emarat” TV program. Discover how tissue bio-engineering is rewriting the lives of burn survivors, offering renewed hope and confidence.',
      },

      { type: 'heading', text: 'Understanding Tissue Bio-Engineering for Burn Scars' },
      {
        type: 'paragraph',
        text: 'Tissue bio-engineering represents a modern leap in regenerative medicine, leveraging the body’s innate ability to regenerate and heal skin tissue. This technique stimulates natural skin regrowth by combining biological materials with components from the patient’s body.',
      },
      {
        type: 'list',
        items: [
          'It harnesses the body’s own healing powers.',
          'It promotes faster and more complete recovery.',
          'Effective for treating diabetic foot ulcers.',
          'Patients experience improved mental health due to less pain and faster results.',
        ],
      },

      { type: 'heading', text: 'How Does Tissue Bioengineering Work?' },
      {
        type: 'paragraph',
        text: 'Imagine your skin as a house that needs repair. Instead of using foreign materials, tissue bio-engineering uses the original “bricks” (skin cells) and “building supplies” (growth factors) from your body to rebuild.',
      },
      {
        type: 'list',
        items: [
          'Growth factors regulate skin cell growth, preventing abnormal scar formation.',
          'Controlled lasers and biological scaffolds guide skin regeneration.',
          'The method restores skin layers, including collagen, nerves, and blood vessels.',
          'This creates flexible, natural-looking skin without restricting movement.',
        ],
      },

      { type: 'heading', text: 'Clinical Advantages of Bio-Tissue Engineering' },
      { type: 'paragraph', text: 'The clinical benefits are immense:' },
      {
        type: 'list',
        items: [
          'Reduced Risk of Infection: Less invasive means lower infection rates.',
          'Improved Mobility: Ideal for scars near joints or on the face.',
          'Shorter Treatment Times: Accelerates healing and recovery.',
          'Psychological Well-Being: Visible improvements uplift patient spirits.',
          // Truncated in the source; kept as supplied until the clinic sends the full sentence.
          'Cost-Effective: Minimizes hospital stays and the need for extensive car',
        ],
      },

      { type: 'heading', text: 'Ideal Timing for Treatment' },
      { type: 'paragraph', text: 'Timely intervention yields the best results:' },
      {
        type: 'image',
        src: '/images/burn-treatment-timeline.webp',
        alt: burnTimelineAlt,
        width: 816,
        height: 696,
      },

      { type: 'heading', text: 'Who Can Benefit?' },
      { type: 'paragraph', text: 'This treatment is effective for various burn types:' },
      {
        type: 'image',
        src: '/images/burn-types.webp',
        alt: 'Diagram titled “Types of burns” with three cards: Hot Burns, burns caused by hot water or fire; Chemical Burns, burns caused by dangerous chemical substances; Radiation Burns, burns caused by radiation, such as cancer therapy',
        width: 756,
        height: 395,
      },
      {
        type: 'paragraph',
        text: 'Even deep burns involving muscle and nerve damage can see improved functionality.',
      },

      { type: 'heading', text: 'Transformative Psychological and Social Impact' },
      {
        type: 'paragraph',
        text: 'Burn survivors often struggle with trauma, isolation, and diminished self-esteem. **Tissue engineering** addresses not just the physical scars but also the emotional wounds.',
      },
      {
        type: 'paragraph',
        text: 'Consider the story of “**Yousef**” (not his real name), who suffered severe chest scars and profound psychological distress. Through dedicated treatment sessions, he rediscovered hope and a desire to help others facing similar struggles.',
      },

      { type: 'heading', text: 'Economic Advantages' },
      {
        type: 'paragraph',
        text: 'Compared to traditional methods, bio-tissue engineering is economically sound:',
      },
      {
        type: 'list',
        items: [
          'Shorter hospital stays reduce costs.',
          'Fewer surgeries save money.',
          'Faster recovery means patients return to work sooner.',
          'It reduces the overall strain on healthcare resources.',
        ],
      },

      { type: 'heading', text: 'Practical Advice' },
      {
        type: 'list',
        items: [
          'tissue Bioengineering offers a revolutionary approach to scarless burn healing.',
          'Early treatment leads to better results, but older scars can also benefit.',
          'It is a safe, minimally invasive, and psychologically supportive treatment.',
          'Seek specialists familiar with advanced regenerative therapies.',
          'Follow treatment protocols closely for optimal outcomes.',
        ],
      },

      { type: 'heading', text: 'Frequently Asked Questions (FAQ)' },
      {
        type: 'faq',
        items: [
          {
            question: 'How is bio-tissue engineering different from traditional scar treatments?',
            answer:
              'Unlike traditional methods, bio-tissue engineering uses the patient’s own cells and growth factors to regenerate skin naturally without surgery or skin grafts.',
          },
          {
            question: 'Can bio-tissue engineering improve old burn scars?',
            answer:
              'Yes, this technique can improve scars regardless of age by softening and regenerating skin layers using nanotechnology.',
          },
          {
            question: 'Is this approach effective for all types of burns?',
            answer:
              'It is effective for thermal, chemical, and radiation burns, restoring both the appearance and functionality of the skin.',
          },
          {
            question: 'When is the best time to begin treatment after a burn?',
            answer:
              'Early intervention yields the best results, but treatment can still be effective for older scars.',
          },
          {
            question: 'Can bio-tissue engineering restore movement affected by burn scars?',
            answer:
              'Yes, it can restore skin flexibility and joint function by regenerating natural tissue and reducing scar-related tightness.',
          },
          {
            question: 'What are the psychological benefits of this treatment?',
            answer:
              'Patients often experience improved self-esteem, reduced trauma, and enhanced social integration due to better cosmetic results and faster healing.',
          },
          {
            question: 'How does this treatment impact healthcare costs?',
            answer:
              'By reducing the need for surgeries, hospital stays, and extensive care, bio-tissue engineering helps lower costs for patients and the healthcare system.',
          },
          {
            question: 'Are multiple treatment sessions required for optimal results?',
            answer:
              'Treatment is tailored to each patient’s needs, often involving several sessions over a period of weeks or months for the best possible results.',
          },
        ],
      },
    ],
  },
];
