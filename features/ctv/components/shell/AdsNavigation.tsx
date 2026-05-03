"use client";

import Image from "next/image";

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 3.5C16.69 3.5 20.5 7.31 20.5 12C20.5 16.69 16.69 20.5 12 20.5C7.31 20.5 3.5 16.69 3.5 12C3.5 7.31 7.31 3.5 12 3.5Z" fill="currentColor"/>
      <path d="M10.17 7.33L13.52 9.48C14.32 9.99 14.55 11.05 14.04 11.85C13.53 12.65 12.47 12.88 11.67 12.37C11.46 12.23 11.28 12.05 11.15 11.85L9 8.5C8.75 8.11 8.86 7.59 9.25 7.33C9.54 7.15 9.9 7.16 10.17 7.33Z" fill="currentColor"/>
      <path fillRule="nonzero" d="M3.25 16.5H21.25V15H3.25V16.5Z" fill="currentColor"/>
      <path d="M13 3C13 3.55 12.55 4 12 4C11.45 4 11 3.55 11 3C11 2.45 11.45 2 12 2C12.55 2 13 2.45 13 3ZM19.5 12C18.95 12 18.5 11.55 18.5 11C18.5 10.45 18.95 10 19.5 10C20.05 10 20.5 10.45 20.5 11C20.5 11.55 20.05 12 19.5 12ZM4.5 12C3.95 12 3.5 11.55 3.5 11C3.5 10.45 3.95 10 4.5 10C5.05 10 5.5 10.45 5.5 11C5.5 11.55 5.05 12 4.5 12ZM18.01 6.07C17.62 6.46 16.99 6.46 16.6 6.07C16.21 5.68 16.21 5.05 16.6 4.66C16.99 4.27 17.62 4.27 18.01 4.66C18.4 5.05 18.4 5.68 18.01 6.07ZM5.99 6.07C5.6 5.68 5.6 5.05 5.99 4.66C6.38 4.27 7.01 4.27 7.4 4.66C7.79 5.05 7.79 5.68 7.4 6.07C7.01 6.46 6.38 6.46 5.99 6.07Z" fill="currentColor"/>
    </svg>
  );
}

function DataTableIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M3.75 19.5H20.25C20.66 19.5 21 19.16 21 18.75V5.25C21 4.84 20.66 4.5 20.25 4.5H3.75C3.34 4.5 3 4.84 3 5.25V18.75C3 19.16 3.34 19.5 3.75 19.5ZM4.5 18V6H19.5V18H4.5Z" fill="currentColor"/>
      <path d="M10 9.25V18.75C10 19.16 10.34 19.5 10.75 19.5C11.16 19.5 11.5 19.16 11.5 18.75V9.25C11.5 8.84 11.16 8.5 10.75 8.5C10.34 8.5 10 8.84 10 9.25ZM17.5 9.25V18.75C17.5 19.16 17.84 19.5 18.25 19.5C18.66 19.5 19 19.16 19 18.75V9.25C19 8.84 18.66 8.5 18.25 8.5C17.84 8.5 17.5 8.84 17.5 9.25Z" fill="currentColor"/>
      <path d="M3.75 15H20.25C20.66 15 21 14.66 21 14.25C21 13.84 20.66 13.5 20.25 13.5H3.75C3.34 13.5 3 13.84 3 14.25C3 14.66 3.34 15 3.75 15ZM3.75 10.5H20.25C20.66 10.5 21 10.16 21 9.75C21 9.34 20.66 9 20.25 9H3.75C3.34 9 3 9.34 3 9.75C3 10.16 3.34 10.5 3.75 10.5Z" fill="currentColor"/>
    </svg>
  );
}

function NoteStackIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M5 4C4.44772 4 4 4.44772 4 5V17C4 17.5523 4.44772 18 5 18H15C15.5523 18 16 17.5523 16 17V5C16 4.44772 15.5523 4 15 4H5ZM5.5 16.5V5.5H14.5V16.5H5.5Z" fill="currentColor"/>
      <path d="M18 7H19C19.5523 7 20 7.44772 20 8V19C20 19.5523 19.5523 20 19 20H8C7.44772 20 7 19.5523 7 19V18H8.5V18.5H18.5V8.5H18V7Z" fill="currentColor"/>
      <path d="M7 8H12C12.2761 8 12.5 8.22386 12.5 8.5C12.5 8.77614 12.2761 9 12 9H7C6.72386 9 6.5 8.77614 6.5 8.5C6.5 8.22386 6.72386 8 7 8Z" fill="currentColor"/>
      <path d="M7 11H12C12.2761 11 12.5 11.2239 12.5 11.5C12.5 11.7761 12.2761 12 12 12H7C6.72386 12 6.5 11.7761 6.5 11.5C6.5 11.2239 6.72386 11 7 11Z" fill="currentColor"/>
      <path d="M7 14H10C10.2761 14 10.5 14.2239 10.5 14.5C10.5 14.7761 10.2761 15 10 15H7C6.72386 15 6.5 14.7761 6.5 14.5C6.5 14.2239 6.72386 14 7 14Z" fill="currentColor"/>
    </svg>
  );
}

function GroupIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.25 9.5C6.71 9.5 5.5 8.14 5.5 6.5C5.5 4.74 6.48 3.5 8.25 3.5C10.02 3.5 11 4.74 11 6.5C11 8.14 9.79 9.5 8.25 9.5ZM8.25 8C8.92 8 9.5 7.35 9.5 6.5C9.5 5.5 9.11 5 8.25 5C7.39 5 7 5.5 7 6.5C7 7.35 7.58 8 8.25 8Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.75 9.5C14.21 9.5 13 8.14 13 6.5C13 4.74 13.98 3.5 15.75 3.5C17.52 3.5 18.5 4.74 18.5 6.5C18.5 8.14 17.29 9.5 15.75 9.5ZM15.75 8C16.42 8 17 7.35 17 6.5C17 5.5 16.61 5 15.75 5C14.89 5 14.5 5.5 14.5 6.5C14.5 7.35 15.08 8 15.75 8Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 8.5C9.55 8.5 8 6.81 8 4.75C8 2.52 9.24 1 11.5 1C13.76 1 15 2.52 15 4.75C15 6.81 13.45 8.5 11 8.5H12ZM12 7C13.09 7 14 6.01 14 4.75C14 3.29 13.36 2.5 12 2.5C10.64 2.5 10 3.29 10 4.75C10 6.01 10.91 7 12 7Z" fill="currentColor"/>
      <path d="M15.9 18H7.1C5.95 18 5 17.05 5 15.9V15.17C5 12.32 7.32 10 10.17 10H12.84C15.68 10 18 12.32 18 15.17V15.9C18 17.05 17.05 18 15.9 18ZM15.9 16.5C16.23 16.5 16.5 16.23 16.5 15.9V15.17C16.5 13.15 14.85 11.5 12.84 11.5H10.17C8.15 11.5 6.5 13.15 6.5 15.17V15.9C6.5 16.23 6.77 16.5 7.1 16.5H15.9Z" fill="currentColor"/>
      <path d="M7.57 11.43C6.86 10.84 5.96 10.5 5.01 10.5H3.49C1.33 10.5 0 12.22 0 14.36V14.54C0 15.62 0.88 16.5 1.96 16.5H5.75V15H1.96C1.71 15 1.5 14.79 1.5 14.54V14.36C1.5 12.99 2.62 12 3.49 12H5.01C5.6 12 6.16 12.21 6.61 12.58L7.57 11.43Z" fill="currentColor"/>
      <path d="M16.39 12.58C16.84 12.21 17.4 12 17.99 12H19.51C20.88 12 22 12.99 22 14.36V14.54C22 14.79 21.79 15 21.54 15H17.75V16.5H21.54C22.62 16.5 23.5 15.62 23.5 14.54V14.36C23.5 12.22 22.17 10.5 20.01 10.5H18.49C17.54 10.5 16.64 10.84 15.93 11.43L16.39 12.58Z" fill="currentColor"/>
    </svg>
  );
}

function CardHorizontalIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M19.25 17.5H4.75C2.68 17.5 1 15.82 1 13.75V7.25C1 5.18 2.68 3.5 4.75 3.5H19.25C21.32 3.5 23 5.18 23 7.25V13.75C23 15.82 21.32 17.5 19.25 17.5ZM19.25 16C20.49 16 21.5 14.99 21.5 13.75V7.25C21.5 6.01 20.49 5 19.25 5H4.75C3.51 5 2.5 6.01 2.5 7.25V13.75C2.5 14.99 3.51 16 4.75 16H19.25Z" fill="currentColor"/>
      <path d="M1.75 7.25H21.75C22.16 7.25 22.5 6.91 22.5 6.5C22.5 6.09 22.16 5.75 21.75 5.75H1.75C1.34 5.75 1 6.09 1 6.5C1 6.91 1.34 7.25 1.75 7.25Z" fill="currentColor"/>
      <path d="M8.75 12H2.25C1.84 12 1.5 11.66 1.5 11.25C1.5 10.84 1.84 10.5 2.25 10.5H8.75C9.16 10.5 9.5 10.84 9.5 11.25C9.5 11.66 9.16 12 8.75 12Z" fill="currentColor"/>
      <path d="M16.75 12H13.25C12.84 12 12.5 11.66 12.5 11.25C12.5 10.84 12.84 10.5 13.25 10.5H16.75C17.16 10.5 17.5 10.84 17.5 11.25C17.5 11.66 17.16 12 16.75 12Z" fill="currentColor"/>
    </svg>
  );
}

function AdAccountIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M11.75 16H4.25C2.45 16 1 14.55 1 12.75V6.25C1 4.45 2.45 3 4.25 3H11.75C13.55 3 15 4.45 15 6.25V12.75C15 14.55 13.55 16 11.75 16ZM11.75 14.5C12.72 14.5 13.5 13.72 13.5 12.75V6.25C13.5 5.28 12.72 4.5 11.75 4.5H4.25C3.28 4.5 2.5 5.28 2.5 6.25V12.75C2.5 13.72 3.28 14.5 4.25 14.5H11.75Z" fill="currentColor"/>
      <path d="M4.75 10H11.25C11.66 10 12 9.66 12 9.25V4.75C12 4.34 11.66 4 11.25 4H4.75C4.34 4 4 4.34 4 4.75V9.25C4 9.66 4.34 10 4.75 10ZM5.5 8.5V5.5H10.5V8.5H5.5Z" fill="currentColor"/>
      <path d="M4.75 13H7.25C7.66 13 8 12.66 8 12.25C8 11.84 7.66 11.5 7.25 11.5H4.75C4.34 11.5 4 11.84 4 12.25C4 12.66 4.34 13 4.75 13Z" fill="currentColor"/>
      <path d="M9.75 13H11.25C11.66 13 12 12.66 12 12.25C12 11.84 11.66 11.5 11.25 11.5H9.75C9.34 11.5 9 11.84 9 12.25C9 12.66 9.34 13 9.75 13Z" fill="currentColor"/>
      <path d="M17.75 6.5H22.25C22.66 6.5 23 6.16 23 5.75C23 5.34 22.66 5 22.25 5H17.75C17.34 5 17 5.34 17 5.75C17 6.16 17.34 6.5 17.75 6.5Z" fill="currentColor"/>
      <path d="M17.75 17.5H22.25C22.66 17.5 23 17.16 23 16.75C23 16.34 22.66 16 22.25 16H17.75C17.34 16 17 16.34 17 16.75C17 17.16 17.34 17.5 17.75 17.5Z" fill="currentColor"/>
      <path d="M17.75 12H22.25C22.66 12 23 11.66 23 11.25C23 10.84 22.66 10.5 22.25 10.5H17.75C17.34 10.5 17 10.84 17 11.25C17 11.66 17.34 12 17.75 12Z" fill="currentColor"/>
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="5" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <circle cx="19" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5Z" fill="currentColor"/>
      <path d="M10 14.5C10.5523 14.5 11 14.0523 11 13.5C11 12.9477 10.5523 12.5 10 12.5C9.44772 12.5 9 12.9477 9 13.5C9 14.0523 9.44772 14.5 10 14.5Z" fill="currentColor"/>
      <path d="M10 11.5C9.44772 11.5 9 11.0523 9 10.5V10C9 9.17157 9.67157 8.5 10.5 8.5C11.3284 8.5 12 7.82843 12 7C12 6.17157 11.3284 5.5 10.5 5.5C9.67157 5.5 9 6.17157 9 7H7.5C7.5 5.34315 8.84315 4 10.5 4C12.1569 4 13.5 5.34315 13.5 7C13.5 8.38071 12.5561 9.54296 11.2824 9.89407C11.1109 9.94088 11 10.0977 11 10.275V10.5C11 11.0523 10.5523 11.5 10 11.5Z" fill="currentColor"/>
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10 2C7.23858 2 5 4.23858 5 7V10.5858L3.29289 12.2929C3.10536 12.4804 3 12.7348 3 13V14C3 14.5523 3.44772 15 4 15H16C16.5523 15 17 14.5523 17 14V13C17 12.7348 16.8946 12.4804 16.7071 12.2929L15 10.5858V7C15 4.23858 12.7614 2 10 2ZM13.5 7V11C13.5 11.2652 13.6054 11.5196 13.7929 11.7071L15.5 13.4142V13.5H4.5V13.4142L6.20711 11.7071C6.39464 11.5196 6.5 11.2652 6.5 11V7C6.5 5.067 8.067 3.5 10 3.5C11.933 3.5 13.5 5.067 13.5 7Z" fill="currentColor"/>
      <path d="M8 16C8 17.1046 8.89543 18 10 18C11.1046 18 12 17.1046 12 16H8Z" fill="currentColor"/>
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5ZM10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.5 2C8.22386 2 8 2.22386 8 2.5V3.67101C7.09878 3.98194 6.28438 4.47553 5.60096 5.10899L4.58541 4.52295C4.34622 4.38486 4.03987 4.46657 3.90178 4.70576L2.40178 7.29424C2.26369 7.53343 2.3454 7.83978 2.58459 7.97787L3.59854 8.56304C3.53675 8.86987 3.5 9.18666 3.5 9.5C3.5 9.81334 3.53675 10.1301 3.59854 10.437L2.58459 11.0221C2.3454 11.1602 2.26369 11.4666 2.40178 11.7058L3.90178 14.2942C4.03987 14.5334 4.34622 14.6151 4.58541 14.4771L5.60096 13.891C6.28438 14.5245 7.09878 15.0181 8 15.329V16.5C8 16.7761 8.22386 17 8.5 17H11.5C11.7761 17 12 16.7761 12 16.5V15.329C12.9012 15.0181 13.7156 14.5245 14.399 13.891L15.4146 14.4771C15.6538 14.6151 15.9601 14.5334 16.0982 14.2942L17.5982 11.7058C17.7363 11.4666 17.6546 11.1602 17.4154 11.0221L16.4015 10.437C16.4632 10.1301 16.5 9.81334 16.5 9.5C16.5 9.18666 16.4632 8.86987 16.4015 8.56304L17.4154 7.97787C17.6546 7.83978 17.7363 7.53343 17.5982 7.29424L16.0982 4.70576C15.9601 4.46657 15.6538 4.38486 15.4146 4.52295L14.399 5.10899C13.7156 4.47553 12.9012 3.98194 12 3.67101V2.5C12 2.22386 11.7761 2 11.5 2H8.5ZM9.5 3.5V4.5C9.5 4.72543 9.35484 4.92431 9.14018 4.99279C8.05602 5.32632 7.10779 5.94837 6.38439 6.77298C6.23455 6.94362 5.99422 7.01044 5.77639 6.93541L4.86603 6.62349L4.11603 7.92265L5.02639 8.23457C5.24422 8.30961 5.38938 8.51849 5.38938 8.75392C5.38938 8.99935 5.24422 9.20823 5.02639 9.28327L4.11603 9.59519L4.86603 10.8944L5.77639 10.5824C5.99422 10.5074 6.23455 10.5742 6.38439 10.7449C7.10779 11.5695 8.05602 12.1915 9.14018 12.5251C9.35484 12.5935 9.5 12.7924 9.5 13.0179V14H10.5V13.0179C10.5 12.7924 10.6452 12.5935 10.8598 12.5251C11.944 12.1915 12.8922 11.5695 13.6156 10.7449C13.7655 10.5742 14.0058 10.5074 14.2236 10.5824L15.134 10.8944L15.884 9.59519L14.9736 9.28327C14.7558 9.20823 14.6106 8.99935 14.6106 8.75392C14.6106 8.51849 14.7558 8.30961 14.9736 8.23457L15.884 7.92265L15.134 6.62349L14.2236 6.93541C14.0058 7.01044 13.7655 6.94362 13.6156 6.77298C12.8922 5.94837 11.944 5.32632 10.8598 4.99279C10.6452 4.92431 10.5 4.72543 10.5 4.5V3.5H9.5Z" fill="currentColor"/>
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15ZM9 13.5C11.4853 13.5 13.5 11.4853 13.5 9C13.5 6.51472 11.4853 4.5 9 4.5C6.51472 4.5 4.5 6.51472 4.5 9C4.5 11.4853 6.51472 13.5 9 13.5Z" fill="currentColor"/>
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export function AdsNavigation() {
  const mainNavItems: NavItem[] = [
    { icon: <DashboardIcon className="text-[#080809]" />, label: "Dashboard" },
    { icon: <DataTableIcon className="text-[#080809]" />, label: "Campaigns", active: true },
    { icon: <NoteStackIcon className="text-[#080809]" />, label: "Audiences" },
    { icon: <GroupIcon className="text-[#080809]" />, label: "Partners" },
    { icon: <CardHorizontalIcon className="text-[#080809]" />, label: "Assets" },
    { icon: <AdAccountIcon className="text-[#080809]" />, label: "Ad Account" },
    { icon: <MoreIcon className="text-[#080809]" />, label: "More" },
  ];

  const footerNavItems: NavItem[] = [
    { icon: <HelpIcon className="text-[#283943]" />, label: "Help" },
    { icon: <BellIcon className="text-[#283943]" />, label: "Notifications" },
    { icon: <SettingsIcon className="text-[#283943]" />, label: "Settings" },
    { icon: <SearchIcon className="text-[#283943]" />, label: "Search" },
  ];

  return (
    <div className="w-[56px] h-full bg-white border-r border-[#CBD2D9] flex flex-col items-center py-2 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
      {/* Meta Logo */}
      <div className="h-10 flex items-center justify-center mb-2">
        <Image 
          src="/images/meta-logo.png" 
          alt="Meta" 
          width={28} 
          height={16} 
          className="object-contain"
        />
      </div>

      {/* Account selector */}
      <div className="w-8 h-8 rounded-[6px] mb-4 overflow-hidden">
        <Image 
          src="/images/geo-media-item.png" 
          alt="Account" 
          width={32} 
          height={32} 
          className="object-cover"
        />
      </div>

      {/* Main nav items */}
      <div className="flex flex-col gap-1 flex-1">
        {mainNavItems.map((item) => (
          <button
            key={item.label}
            className={`
              w-10 h-10 rounded-[4px] flex items-center justify-center
              transition-colors
              ${item.active 
                ? "bg-[#E1EDF7]" 
                : "hover:bg-[#F8F9FB]"
              }
            `}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-[#CBD2D9] my-2" />

      {/* Footer nav items */}
      <div className="flex flex-col gap-0">
        {footerNavItems.map((item) => (
          <button
            key={item.label}
            className="w-11 h-9 rounded-[6px] flex items-center justify-center hover:bg-[#F8F9FB] transition-colors"
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
