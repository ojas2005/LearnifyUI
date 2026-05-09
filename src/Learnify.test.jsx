import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Learnify from './Learnify';

// ─── Mocks ───────────────────────────────────────────────────────────────────
beforeEach(() => {
  fetch.resetMocks();
  localStorage.clear();
  
  // Default mock for initial loads
  fetch.mockResponse((req) => {
    if (req.url.includes('/accounts/me')) {
      return Promise.resolve({ status: 401, body: JSON.stringify({ message: 'Unauthorized' }) });
    }
    if (req.url.includes('/api/courses')) {
      return Promise.resolve({
        status: 200,
        body: JSON.stringify([
          { id: 1, title: 'React Mastery', instructor: 'Ojas', topic: 'Programming', averageRating: 4.8, approvedReviewCount: 10, listPrice: 29.99, difficulty: 0 }
        ])
      });
    }
    return Promise.resolve({ status: 200, body: JSON.stringify([]) });
  });
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Learnify Comprehensive Suite', () => {

  test('Navigation: switching between Landing and Catalog', async () => {
    await act(async () => { render(<Learnify />); });

    // In Landing Page
    expect(screen.getByText(/Learn Anything/i)).toBeInTheDocument();

    // Click "Browse Courses" button in Hero
    const browseBtn = screen.getByText(/Browse Courses/i);
    await act(async () => { fireEvent.click(browseBtn); });

    // Now in Catalog Page
    expect(screen.getByPlaceholderText(/Search courses.../i)).toBeInTheDocument();
    expect(screen.getByText(/1 courses found/i)).toBeInTheDocument();
  });

  test('Auth Flow: Rendering Login and Registration', async () => {
    await act(async () => { render(<Learnify />); });

    // Go to Login
    const signInBtn = screen.getByText(/Sign In/i);
    await act(async () => { fireEvent.click(signInBtn); });
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();

    // Switch to Register
    const signUpLink = screen.getByText(/Sign up free/i);
    await act(async () => { fireEvent.click(signUpLink); });
    expect(screen.getByText(/Join Learnify/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
  });

  test('Catalog: Filtering by Topic', async () => {
    await act(async () => { render(<Learnify />); });
    await act(async () => { fireEvent.click(screen.getByText(/Browse Courses/i)); });

    // Click "Programming" topic pill (use getAllByText as it's in multiple places)
    const progPills = screen.getAllByText(/^Programming$/i);
    await act(async () => { fireEvent.click(progPills[0]); });

    // Verify course still exists (mock has programming)
    expect(screen.getByText(/React Mastery/i)).toBeInTheDocument();

    // Click "Design" (mock doesn't have it)
    const designPills = screen.getAllByText(/^Design$/i);
    await act(async () => { fireEvent.click(designPills[0]); });
    expect(screen.getByText(/No courses match your filters/i)).toBeInTheDocument();
  });

  test('Course Detail: Viewing course details and curriculum', async () => {
    await act(async () => { render(<Learnify />); });
    
    // Mock curriculum response
    fetch.mockResponseOnce(JSON.stringify([
      { id: 101, title: 'Introduction', durationMinutes: 5, format: 'video' }
    ]));

    // Click on the course card
    const courseCard = screen.getByText(/React Mastery/i);
    await act(async () => { fireEvent.click(courseCard); });

    // Verify detail view
    expect(screen.getByText(/curriculum/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Introduction/i)).toBeInTheDocument());
    expect(screen.getByText(/Enroll Now/i)).toBeInTheDocument();
  });

  test('Role-Based Access: Admin Panel Visibility', async () => {
    // Mock Admin user
    fetch.mockResponse((req) => {
      if (req.url.includes('/accounts/me')) {
        return Promise.resolve({
          status: 200,
          body: JSON.stringify({ id: 99, displayName: 'Admin User', role: 'Administrator' })
        });
      }
      return Promise.resolve({ status: 200, body: JSON.stringify([]) });
    });
    localStorage.setItem('token', 'fake-admin-token');

    await act(async () => { render(<Learnify />); });

    // Admin link should be visible
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
    
    await act(async () => { fireEvent.click(screen.getByText(/Admin/i)); });
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
    // Look for the "Pending" tab specifically or any instance of Pending
    expect(screen.getAllByText(/Pending/i).length).toBeGreaterThan(0);
  });

  test('Player: Navigation and Marking Complete', async () => {
    // Mock Learner with enrollment
    fetch.mockResponse((req) => {
      if (req.url.includes('/accounts/me')) return Promise.resolve({ status: 200, body: JSON.stringify({ id: 1, role: 'Learner' }) });
      if (req.url.includes('/registrations/learner')) return Promise.resolve({ status: 200, body: JSON.stringify([{ courseId: 1, courseTitle: 'React Mastery' }]) });
      if (req.url.includes('/curriculum/course/1')) return Promise.resolve({ status: 200, body: JSON.stringify([{ id: 101, title: 'Intro', durationMinutes: 5, format: 'video' }]) });
      return Promise.resolve({ status: 200, body: JSON.stringify([]) });
    });
    localStorage.setItem('token', 'fake-learner-token');

    await act(async () => { render(<Learnify />); });

    // Go to Player (directly via Dashboard)
    await act(async () => { fireEvent.click(screen.getByText(/Dashboard/i)); });
    const continueBtn = screen.getByText(/▶ Continue/i);
    await act(async () => { fireEvent.click(continueBtn); });

    // In Player
    expect(screen.getByText(/Curriculum/i)).toBeInTheDocument();
    // Use getAllByText for Intro since it appears in sidebar and title
    expect(screen.getAllByText(/Intro/i).length).toBeGreaterThan(0);

    // Mark Complete
    const completeBtn = screen.getByText(/Mark Complete/i);
    await act(async () => { fireEvent.click(completeBtn); });
    expect(screen.getByText(/Lesson completed!/i)).toBeInTheDocument();
  });

});
