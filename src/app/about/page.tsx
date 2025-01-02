import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { Stack } from '@/components/layout/stack';
import { Text } from '@/components/typography/typography';

export default function AboutPage() {
  return (
    <PageLayout
      variant="narrow"
    >
      <Stack spacing="lg">
        <section>
          <Text variant="h1" className="text-3xl font-bold text-datacite-dark-blue mb-6">
            About DataCite Metadata Health Reports
          </Text>
          <Text variant="h2" className="text-xl font-semibold text-datacite-dark-blue mb-4">
            Overview
          </Text>
          <Text variant="body" className="text-gray-700 mb-4">
            DataCite Metadata Health Reports is a test application for providing insights into the quality and completeness of metadata 
            records across DataCite&apos;s network of members and their repositories. It is in an alpha state so things may change and break! The data it presents is not current. It is based on the <Link href="https://doi.org/10.14454/zhaw-tm22" className="text-datacite-light-blue hover:text-datacite-dark-blue">DataCite Public Data File 2023</Link>.
          </Text>
        </section>

        <section>
          <Text variant="h2" className="text-xl font-semibold text-datacite-dark-blue mb-4">
            How to Use
          </Text>
          <Stack spacing="sm">
            <Text variant="body" className="text-gray-700 mb-4">
              Start by using the <Link href="/" className="text-datacite-light-blue hover:text-datacite-dark-blue">search functionality</Link> to 
              find specific members or repositories. You can:
            </Text>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>View individual metadata health reports</li>
              <li>Compare multiple organizations</li>
              <li>Analyze specific metadata fields</li>
              <li>Track improvements over time</li>
              <li>Generate insights for metadata quality enhancement</li>
            </ul>
          </Stack>
        </section>

        <section>
          <Text variant="body" className="text-gray-700 mb-4">
            The <Link href="/compare" className="text-datacite-light-blue hover:text-datacite-dark-blue">comparison feature</Link> allows you to analyze metadata health across different organizations side by side. You can select multiple repositories or members to:
          </Text>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Compare overall metadata completeness scores</li>
            <li>Identify differences in specific metadata fields</li>
            <li>Benchmark metadata practices across organizations and repositories</li>
          </ul>
        </section>

        <section>
          <Text variant="h2" className="text-xl font-semibold text-datacite-dark-blue mb-4">
            Contact
          </Text>
          <Text variant="body" className="text-gray-700">
            For questions or feedback about the Metadata Health Reports, please contact{' '}
            <a 
              href="mailto:support@datacite.org" 
              className="text-datacite-light-blue hover:text-datacite-dark-blue"
            >
              support@datacite.org
            </a>
          </Text>
        </section>
      </Stack>
    </PageLayout>
  );
}
