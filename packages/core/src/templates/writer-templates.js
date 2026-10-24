/**
 * Zoffice ZWriter Templates
 * Original professional document templates formatted in semantic HTML.
 * @module writer-templates
 */

export const WRITER_TEMPLATES = [
  {
    id: 'resume-modern',
    title: 'Modern Chronological Resume',
    description: 'Clean, elegant layout with executive summary, experience bullets, and skills.',
    appId: 'writer',
    category: 'documents',
    icon: 'FileText',
    content: `<div style="font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #1e293b;">
  <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 4px; color: #0f172a;">ALEXANDER WRIGHT</h1>
  <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 16px;">
    Senior Product Engineer &bull; alex.wright@example.com &bull; +1 (555) 234-5678 &bull; San Francisco, CA
  </p>
  <hr style="border: 0; border-top: 2px solid #2563eb; margin-bottom: 20px;" />

  <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 8px;">Executive Summary</h2>
  <p style="font-size: 13px; margin-bottom: 16px;">
    Results-driven Lead Engineer with over 8 years of experience architecting resilient desktop and web solutions. Proven track record in scaling cross-functional teams, reducing latency by 45%, and championing privacy-first software principles.
  </p>

  <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 8px;">Professional Experience</h2>
  <div style="margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 14px;">
      <span>Staff Software Architect &bull; Apex Systems</span>
      <span style="color: #64748b;">2022 &ndash; Present</span>
    </div>
    <ul style="font-size: 13px; margin-top: 6px; padding-left: 20px;">
      <li>Spearheaded offline-first local database sync serving 1.2M monthly active sessions.</li>
      <li>Mentored 12 junior and mid-level engineers, accelerating sprint velocity by 30%.</li>
      <li>Designed automated end-to-end test pipelines ensuring 99.8% regression-free releases.</li>
    </ul>
  </div>

  <div style="margin-bottom: 16px;">
    <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 14px;">
      <span>Senior Application Developer &bull; Nova Dynamics</span>
      <span style="color: #64748b;">2018 &ndash; 2022</span>
    </div>
    <ul style="font-size: 13px; margin-top: 6px; padding-left: 20px;">
      <li>Engineered high-performance real-time vector canvas with zero dropped frames.</li>
      <li>Migrated monolithic codebase into modular package monorepo structure.</li>
    </ul>
  </div>

  <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 8px;">Education &amp; Credentials</h2>
  <p style="font-size: 13px; margin: 4px 0;"><strong>B.S. in Computer Science</strong> &bull; University of California, Berkeley</p>
  <p style="font-size: 13px; margin: 4px 0; color: #64748b;">Dean's Honor List &bull; Summa Cum Laude</p>
</div>`,
  },
  {
    id: 'letter-cover',
    title: 'Professional Cover Letter',
    description: 'Formal business correspondence layout with sender, recipient, and closing.',
    appId: 'writer',
    category: 'documents',
    icon: 'Mail',
    content: `<div style="font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.7; color: #1e293b;">
  <p style="font-size: 14px; margin-bottom: 4px;"><strong>Sarah Jenkins</strong></p>
  <p style="font-size: 13px; color: #64748b; margin: 0 0 24px 0;">
    452 Innovation Blvd &bull; Boston, MA 02110 &bull; sarah.j@example.com
  </p>

  <p style="font-size: 13px; color: #64748b; margin-bottom: 24px;">October 24, 2026</p>

  <p style="font-size: 14px; margin-bottom: 4px;"><strong>Hiring Committee</strong></p>
  <p style="font-size: 13px; color: #475569; margin: 0 0 24px 0;">
    Horizon Open Technologies<br />
    100 Enterprise Way, Suite 400<br />
    Cambridge, MA 02139
  </p>

  <p style="font-size: 14px; margin-bottom: 14px;"><strong>Dear Hiring Committee,</strong></p>

  <p style="font-size: 13px; margin-bottom: 14px;">
    I am writing to express my enthusiastic interest in the Principal Systems Engineer position at Horizon Open Technologies. With over a decade of hands-on experience building local-first software and robust offline productivity tools, I have long admired your team's dedication to transparent, high-integrity technology.
  </p>

  <p style="font-size: 13px; margin-bottom: 14px;">
    In my previous role, I led the architecture of an extensible plugin sandbox that processed over 500,000 documents with zero security vulnerabilities. I believe my deep expertise in modular JavaScript design and high-efficiency algorithms will allow me to make immediate, meaningful contributions to your team.
  </p>

  <p style="font-size: 13px; margin-bottom: 24px;">
    Thank you for your time and thoughtful consideration. I look forward to discussing how my experience aligns with your upcoming strategic initiatives.
  </p>

  <p style="font-size: 13px; margin-bottom: 30px;">Sincerely,</p>
  <p style="font-size: 14px; font-weight: 700; color: #0f172a;">Sarah Jenkins</p>
</div>`,
  },
  {
    id: 'report-project-proposal',
    title: 'Project Proposal & Report',
    description: 'Executive briefing with problem statement, methodology, schedule, and budget.',
    appId: 'writer',
    category: 'documents',
    icon: 'Briefcase',
    content: `<div style="font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #1e293b;">
  <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px 20px; margin-bottom: 24px;">
    <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a;">Project Aurora: Local Intelligence Architecture</h1>
    <p style="font-size: 13px; color: #64748b; margin: 0;">Comprehensive Project Proposal &bull; Prepared by Global Engineering Taskforce</p>
  </div>

  <h2 style="font-size: 16px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">1. Executive Summary</h2>
  <p style="font-size: 13px; margin-bottom: 16px;">
    Project Aurora introduces an autonomous, zero-telemetry computational layer within the enterprise productivity suite. The objective is to provide on-device automation without transmitting sensitive organizational data across external networks.
  </p>

  <h2 style="font-size: 16px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">2. Problem Definition &amp; Objectives</h2>
  <p style="font-size: 13px; margin-bottom: 16px;">
    Modern knowledge workers encounter severe workflow friction when switching between disconnected cloud providers. This proposal establishes unified offline indexing, sub-millisecond local search, and deterministic formula evaluation.
  </p>

  <h2 style="font-size: 16px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">3. Projected Milestones &amp; Resource Plan</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
    <thead>
      <tr style="background-color: #f1f5f9; text-align: left;">
        <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Phase</th>
        <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Deliverable</th>
        <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Target Date</th>
        <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Est. Budget</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Phase 1</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Core Sandbox &amp; Engine Spec</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Q1 2027</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">$45,000</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Phase 2</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Hardware Acceleration Layer</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Q2 2027</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">$60,000</td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
  {
    id: 'invoice-consulting',
    title: 'Consulting Services Invoice',
    description: 'Itemized billable services invoice with client details, tax, and terms.',
    appId: 'writer',
    category: 'documents',
    icon: 'Receipt',
    content: `<div style="font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #1e293b;">
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px;">
    <div>
      <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0;">INVOICE</h1>
      <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Invoice #: INV-2026-0891</p>
    </div>
    <div style="text-align: right; font-size: 13px; color: #475569;">
      <strong>Vanguard Consulting LLC</strong><br />
      hello@vanguard-consulting.io<br />
      Tax ID: 94-8273910
    </div>
  </div>

  <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13px;">
    <div>
      <span style="color: #64748b; text-transform: uppercase; font-size: 11px; font-weight: 700;">Billed To:</span><br />
      <strong>Acme Global Enterprises</strong><br />
      Attn: Accounts Payable<br />
      742 Evergreen Terrace, Springfield
    </div>
    <div style="text-align: right;">
      <span style="color: #64748b; text-transform: uppercase; font-size: 11px; font-weight: 700;">Payment Terms:</span><br />
      Issue Date: Oct 24, 2026<br />
      Due Date: Nov 24, 2026 (Net 30)
    </div>
  </div>

  <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
    <thead>
      <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left;">
        <th style="padding: 10px 12px;">Service Description</th>
        <th style="padding: 10px 12px; text-align: center;">Hours</th>
        <th style="padding: 10px 12px; text-align: right;">Rate</th>
        <th style="padding: 10px 12px; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px;">Architecture Audit &amp; Performance Profiling</td>
        <td style="padding: 10px 12px; text-align: center;">40</td>
        <td style="padding: 10px 12px; text-align: right;">$175.00</td>
        <td style="padding: 10px 12px; text-align: right;">$7,000.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px;">Accessibility Remediation (WCAG 2.1 AA)</td>
        <td style="padding: 10px 12px; text-align: center;">25</td>
        <td style="padding: 10px 12px; text-align: right;">$175.00</td>
        <td style="padding: 10px 12px; text-align: right;">$4,375.00</td>
      </tr>
    </tbody>
  </table>

  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 250px; font-size: 13px;">
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>Subtotal:</span><strong>$11,375.00</strong>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>Tax (0%):</span><span>$0.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #0f172a; font-size: 15px;">
        <strong>Total Due:</strong><strong style="color: #2563eb;">$11,375.00</strong>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 'minutes-formal',
    title: 'Formal Meeting Minutes',
    description: 'Structured minutes recording attendees, discussion points, and action items.',
    appId: 'writer',
    category: 'documents',
    icon: 'CheckSquare',
    content: `<div style="font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #1e293b;">
  <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Executive Steering Committee Minutes</h1>
  <p style="font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 20px;">
    Date: October 24, 2026 &bull; Time: 10:00 AM &ndash; 11:30 AM EST &bull; Location: Boardroom A / Secure Video
  </p>

  <h2 style="font-size: 15px; font-weight: 700; color: #2563eb; margin-bottom: 6px;">1. Attendees</h2>
  <p style="font-size: 13px; margin-bottom: 16px;">
    <strong>Present:</strong> Marcus Vance (Chair), Elena Rostova (CTO), Tariq Al-Mansoor (VP Eng), Clara Oswald (Secretary)<br />
    <strong>Regrets:</strong> David Kim (General Counsel)
  </p>

  <h2 style="font-size: 15px; font-weight: 700; color: #2563eb; margin-bottom: 6px;">2. Agenda Overview &amp; Key Discussions</h2>
  <ul style="font-size: 13px; padding-left: 20px; margin-bottom: 16px;">
    <li><strong>v1.0.0 Public Release:</strong> Reviewed installer pipeline across Windows, macOS, and Linux. All packaging targets confirmed passing.</li>
    <li><strong>Zero-Telemetry Policy:</strong> Reaffirmed privacy commitment. Verified no network pings occur on application launch.</li>
  </ul>

  <h2 style="font-size: 15px; font-weight: 700; color: #2563eb; margin-bottom: 6px;">3. Action Items &amp; Ownership</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
    <thead>
      <tr style="background-color: #f1f5f9; text-align: left;">
        <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Action Item</th>
        <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Owner</th>
        <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Deadline</th>
        <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Tag v1.0.0 Git Release</td>
        <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Elena R.</td>
        <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Nov 1, 2026</td>
        <td style="padding: 8px 10px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 600;">In Progress</td>
      </tr>
      <tr>
        <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Publish Security Disclosure Policy</td>
        <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Marcus V.</td>
        <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Nov 3, 2026</td>
        <td style="padding: 8px 10px; border: 1px solid #e2e8f0; color: #ca8a04; font-weight: 600;">Pending</td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
  {
    id: 'summary-executive',
    title: 'Executive Business Summary',
    description: 'High-level strategic briefing with KPIs, risk analysis, and recommendations.',
    appId: 'writer',
    category: 'documents',
    icon: 'FileText',
    content: `<div style="font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #1e293b;">
  <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">Strategic Quarterly Briefing</h1>
  <p style="font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 24px;">Zoffice Software Ecosystem &bull; Strategic Horizon Q4</p>

  <h2 style="font-size: 15px; font-weight: 700; color: #2563eb; margin-bottom: 8px;">Key Performance Indicators</h2>
  <div style="display: flex; gap: 16px; margin-bottom: 20px;">
    <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
      <div style="font-size: 24px; font-weight: 800; color: #2563eb;">1.34s</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Cold Startup Time</div>
    </div>
    <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
      <div style="font-size: 24px; font-weight: 800; color: #16a34a;">0</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 2px;">External Tracking Requests</div>
    </div>
    <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
      <div style="font-size: 24px; font-weight: 800; color: #0f172a;">100%</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Offline Operational Fidelity</div>
    </div>
  </div>

  <h2 style="font-size: 15px; font-weight: 700; color: #2563eb; margin-bottom: 8px;">Key Strategic Findings</h2>
  <p style="font-size: 13px; margin-bottom: 14px;">
    Adoption velocity has accelerated by 180% following the introduction of native document interoperability (.docx, .xlsx, .pptx) without cloud conversion roundtrips.
  </p>
</div>`,
  },
]
