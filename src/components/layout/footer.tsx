'use client';

import Link from 'next/link';
import { 
  faLinkedin, 
  faGithub, 
  faYoutube, 
  faMastodon,
  faBlogger,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../typography/typography';

const FOOTER_LINKS = {
  about_links: [
    { name: 'Mission', url: 'https://datacite.org/mission.html' },
    { name: 'Team', url: 'https://datacite.org/team/' },
    { name: 'Job Opportunities', url: 'https://datacite.org/job-opportunities/' },
    { name: 'Contact', url: 'https://datacite.org/contact.html' }
  ],
  services_links: [
    { name: 'Create DOIs', url: 'https://datacite.org/create-dois/' },
    { name: 'Metadata Search', url: 'https://commons.datacite.org' },
    { name: 'Stats Portal', url: 'https://stats.datacite.org' },
    { name: 'Service Status', url: 'https://status.datacite.org' }
  ],
  community_links: [
    { name: 'Members', url: 'https://datacite.org/members.html' },
    { name: 'Steering Groups', url: 'https://datacite.org/CESG/' },
    { name: 'Events', url: 'https://datacite.org/events/' }
  ],
  resources_links: [
    { name: 'Documentation', url: 'https://support.datacite.org' },
    { name: 'Community Forum', url: 'https://pidforum.org' },
    { name: 'Fee Model', url: 'https://datacite.org/fee-model/' }
  ]
};

const FooterLinkSection = ({ title, links }: { title: string; links: { name: string; url: string }[] }) => (
  <div className="flex flex-col items-center text-center md:items-start md:text-left">
    <Text 
      variant="h3"
      className="text-[#34495e] mb-2 sm:mb-4" 
      as="h4"
      id={`footer-${title.toLowerCase().replace(/\s+/g, '-')}-heading`}
    >
      {title}
    </Text>
    <ul 
      className="space-y-2 sm:space-y-3" 
      aria-labelledby={`footer-${title.toLowerCase().replace(/\s+/g, '-')}-heading`}
    >
      {links.map((link, index) => (
        <li key={index}>
          <Link 
            href={link.url}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            <Text 
              variant="small"
              className="text-[#34495e] hover:text-[#3498db] transition-colors"
            >
              {link.name}
            </Text>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLinks = () => (
  <div className="flex justify-center sm:justify-start space-x-4">
    <Link 
      href="mailto:support@datacite.org" 
      aria-label="Email DataCite Support" 
      className="text-[#34495e] hover:text-[#3498db] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="h-4 w-4 sm:h-5 sm:w-5" 
        aria-hidden="true" 
        role="img"
      >
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
      </svg>
    </Link>
    {[
      { href: "https://blog.datacite.org", icon: faBlogger, label: "Visit DataCite Blog" },
      { href: "https://www.linkedin.com/company/datacite", icon: faLinkedin, label: "Visit DataCite LinkedIn" },
      { href: "https://github.com/datacite", icon: faGithub, label: "Visit DataCite GitHub" },
      { href: "https://www.youtube.com/channel/UCVsSDZhIN_WbnD_v5o9eB_A", icon: faYoutube, label: "Visit DataCite YouTube" },
      { href: "https://openbiblio.social/@datacite", icon: faMastodon, label: "Visit DataCite Mastodon" }
    ].map((social) => (
      <Link 
        key={social.href}
        href={social.href}
        aria-label={social.label}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      >
        <FontAwesomeIcon 
          icon={social.icon} 
          className="h-4 w-4 sm:h-5 sm:w-5 text-[#34495e] hover:text-[#3498db]" 
          aria-hidden="true" 
        />
      </Link>
    ))}
  </div>
);

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
          <FooterLinkSection title="About" links={FOOTER_LINKS.about_links} />
          <FooterLinkSection title="Services" links={FOOTER_LINKS.services_links} />
          <FooterLinkSection title="Community" links={FOOTER_LINKS.community_links} />
          <FooterLinkSection title="Resources" links={FOOTER_LINKS.resources_links} />
        </div>
        
        <div className="mt-8 sm:mt-12 border-t border-gray-200 pt-8 sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0">
            <Text 
              variant="small"
              className="text-[#34495e] text-center sm:text-left"
            >
              &copy; {new Date().getFullYear()} DataCite. All rights reserved.
            </Text>
            <div className="sm:ml-4 flex space-x-4">
              <Link 
                href="https://datacite.org/privacy.html" 
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                <Text 
                  variant="small"
                  className="text-[#34495e] hover:text-[#3498db] transition-colors"
                >
                  Privacy Policy
                </Text>
              </Link>
              <Link 
                href="https://datacite.org/terms.html" 
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                <Text 
                  variant="small"
                  className="text-[#34495e] hover:text-[#3498db] transition-colors"
                >
                  Terms of Service
                </Text>
              </Link>
              <Text 
                variant="small"
                className="text-[#34495e]"
              >
                Data version: <Link 
                  href="https://doi.org/10.14454/zhaw-tm22"
                  className="hover:text-[#3498db] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  DataCite Public Data File 2023
                </Link>
              </Text>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
