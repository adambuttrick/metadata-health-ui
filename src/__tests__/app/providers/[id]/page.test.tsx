import { render, screen } from '@testing-library/react';
import ProviderDetailsPage from '@/app/providers/[id]/page';

// Mock the ProviderDetails component since it's tested separately
jest.mock('@/components/providers/provider-details', () => ({
  ProviderDetails: () => <div data-testid="provider-details">Provider Details Mock</div>
}));

describe('ProviderDetailsPage', () => {
  it('renders the provider details page with correct props', async () => {
    const params = { id: 'test-provider-id' };
    render(await ProviderDetailsPage({ params }));

    // Check if the ProviderDetails component is rendered
    expect(screen.getByTestId('provider-details')).toBeInTheDocument();
  });
});
