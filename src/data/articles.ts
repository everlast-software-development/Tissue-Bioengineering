import { Article } from '@/types';

/**
 * Article text is the original wording supplied by the clinic: do not shorten, reword or add
 * claims. `**bold**` keeps the original emphasis. Author and date are left out until supplied.
 */
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
];
