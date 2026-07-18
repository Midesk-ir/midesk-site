# Rendering Architecture

```mermaid
%%{init:{'theme':'base','themeVariables':{'background':'#060810','primaryColor':'#0c1a30','primaryTextColor':'#7dd3fc','primaryBorderColor':'#0e3a6e','edgeLabelBackground':'#0c1a30','lineColor':'#334155','secondaryColor':'#0f172a','clusterBkg':'#060c18','clusterBorder':'#1e3a5f','fontFamily':'JetBrains Mono','fontSize':'14'}}}%%
graph LR
  classDef ssr fill:#0d1a0d,stroke:#16a34a,color:#86efac
  classDef csr fill:#2d1200,stroke:#c2410c,color:#fb923c
  classDef ssg fill:#1a0d1a,stroke:#7c3aed,color:#c4b5fd
  classDef isr fill:#1a1a0d,stroke:#ca8a04,color:#fde047
  classDef ppr fill:#0d1a2d,stroke:#2563eb,color:#93c5fd
  classDef unk fill:#1a1a1a,stroke:#6b7280,color:#9ca3af
  classDef pkg fill:#0c1018,stroke:#475569,color:#cbd5e1
  classDef muted fill:#0a0d14,stroke:#374151,color:#64748b,stroke-dasharray: 3 3
  classDef hdr fill:#06080f,stroke:#1e3a5f,color:#7dd3fc
  T1_ai["📁 /ai · 1 route"]:::pkg
  T1_calendar["📁 /calendar · 1 route"]:::pkg
  T1_chat["📁 /chat · 2 routes"]:::pkg
  T1_correspondence["📁 /correspondence · 3 routes"]:::pkg
  subgraph T1_crm_G["📁 /crm · 4 routes"]
    T1_crm_contacts["📁 /contacts · 2 routes"]:::pkg
    T1_crm_opportunities["📁 /opportunities · 1 route"]:::pkg
  end
  T1_dashboard["📁 /dashboard · 1 route"]:::pkg
  subgraph T1_finance_G["📁 /finance · 9 routes"]
    T1_finance_expenses["📁 /expenses · 2 routes"]:::pkg
    T1_finance_PAGES["📄 budgets · invoices · payroll +3 (6 pages)"]:::pkg
  end
  subgraph T1_hr_G["📁 /hr · 12 routes"]
    T1_hr_attendance["📁 /attendance · 2 routes"]:::pkg
    T1_hr_personnel["📁 /personnel · 2 routes"]:::pkg
    T1_hr_recruitment["📁 /recruitment · 2 routes"]:::pkg
    T1_hr_PAGES["📄 contracts · documents · missions +2 (5 pages)"]:::pkg
  end
  T1_root["📁 / · 1 route"]:::pkg
  T1_leave["📁 /leave · 4 routes"]:::pkg
  T1_login["📁 /login · 1 route"]:::pkg
  subgraph T1_meetings_G["📁 /meetings · 3 routes"]
    T1_meetings__id["📁 /:id · 2 routes"]:::pkg
  end
  T1_members["📁 /members · 1 route"]:::pkg
  T1_my_finance["📁 /my-finance · 1 route"]:::pkg
  T1_notes["📁 /notes · 1 route"]:::pkg
  T1_notifications["📁 /notifications · 1 route"]:::pkg
  T1_onboarding["📁 /onboarding · 1 route"]:::pkg
  T1_performance["📁 /performance · 3 routes"]:::pkg
  subgraph T1_projects_G["📁 /projects · 9 routes"]
    subgraph T1_projects__id_G["📁 /:id · 8 routes"]
      T1_projects__id_sprints["📁 /sprints · 3 routes"]:::pkg
      T1_projects__id_PAGES["📄 files · reports · settings (3 pages)"]:::pkg
    end
  end
  T1_register["📁 /register · 1 route"]:::pkg
  T1_reports["📁 /reports · 3 routes"]:::pkg
  T1_settings["📁 /settings · 2 routes"]:::pkg
  T1_subscription["📁 /subscription · 2 routes"]:::pkg
  T1_super_admin["📁 /super-admin · 7 routes"]:::pkg
  subgraph T1_surveys_G["📁 /surveys · 4 routes"]
    T1_surveys__id["📁 /:id · 3 routes"]:::pkg
  end
  T1_teams["📁 /teams · 1 route"]:::pkg
  T1_verify_otp["📁 /verify-otp · 1 route"]:::pkg
  T1_worklog["📁 /worklog · 2 routes"]:::pkg
  T1_ai ~~~ T1_calendar ~~~ T1_chat ~~~ T1_correspondence ~~~ T1_crm_G ~~~ T1_dashboard ~~~ T1_finance_G ~~~ T1_hr_G ~~~ T1_root ~~~ T1_leave ~~~ T1_login ~~~ T1_meetings_G ~~~ T1_members ~~~ T1_my_finance ~~~ T1_notes ~~~ T1_notifications ~~~ T1_onboarding ~~~ T1_performance ~~~ T1_projects_G ~~~ T1_register ~~~ T1_reports ~~~ T1_settings ~~~ T1_subscription ~~~ T1_super_admin ~~~ T1_surveys_G ~~~ T1_teams ~~~ T1_verify_otp ~~~ T1_worklog
```
