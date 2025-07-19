import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0;
`;

const Form = styled.form`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const RatingInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

interface StarInputProps {
  checked?: boolean;
}

const StarInput = styled.label<StarInputProps>`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.checked ? '#ecc94b' : '#cbd5e0'};
  transition: transform 0.2s, color 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  input {
    display: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin: 0.5rem 0;
  resize: vertical;
  font-family: inherit;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 1px #4299e1;
  }
`;

const SubmitButton = styled.button`
  background: #2c5282;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2b6cb0;
    transform: translateY(-1px);
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewItem = styled.div`
  padding: 1rem;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.15rem;
`;

const Star = styled.div<{ $filled: boolean }>`
  color: ${props => props.$filled ? '#ecc94b' : '#cbd5e0'};
  display: flex;
  align-items: center;
`;

const ReviewDate = styled.span`
  color: #718096;
  font-size: 0.85rem;
`;

const Text = styled.p`
  color: #4a5568;
  line-height: 1.5;
  font-size: 0.95rem;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$variant === 'delete' ? '#fff' : '#f7fafc'};
  color: ${props => props.$variant === 'delete' ? '#e53e3e' : '#4a5568'};
  border: 1px solid ${props => props.$variant === 'delete' ? '#e53e3e' : '#e2e8f0'};

  &:hover {
    background: ${props => props.$variant === 'delete' ? '#fff5f5' : '#edf2f7'};
  }
`;

const EditForm = styled.form`
  margin-top: 0.5rem;
`;

const EditTextArea = styled(TextArea)`
  margin-bottom: 0.5rem;
`;

const SaveButton = styled(SubmitButton)`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
`;

const CancelButton = styled(ActionButton)`
  margin-left: 0.5rem;
`;

const ClearReviewsButton = styled(SubmitButton)`
  background: #e53e3e;
  margin-left: 1rem;

  &:hover {
    background: #c53030;
  }
`;

interface Review {
  id: number;
  rating: number;
  text: string;
  date: string;
  userName: string;
  userId: string;
}

interface ReviewsProps {
  productId: number;
}

const StarWrapper = styled.div<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || 'inherit'};
`;

interface StarSymbolProps {
  size: number;
}

const StarSymbol = styled.span<StarSymbolProps>`
  font-size: ${props => props.size === 24 ? '24px' : '20px'};
  line-height: 1;
`;

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editText, setEditText] = useState('');
  const { user } = useAuth();
  const userName = user?.name || 'Anonymous';
  const userId = user?.id || '';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const savedReviews = localStorage.getItem(`product-${productId}-reviews`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [productId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      rating,
      text,
      date: new Date().toLocaleDateString(),
      userName,
      userId
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    
    localStorage.setItem(`product-${productId}-reviews`, JSON.stringify(updatedReviews));
    
    setRating(0);
    setText('');
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditText(review.text);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    const updatedReviews = reviews.map(review => 
      review.id === editingReview.id 
        ? { ...review, text: editText, date: new Date().toLocaleDateString() }
        : review
    );

    setReviews(updatedReviews);
    localStorage.setItem(`product-${productId}-reviews`, JSON.stringify(updatedReviews));
    setEditingReview(null);
    setEditText('');
  };

  const handleDelete = (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem(`product-${productId}-reviews`, JSON.stringify(updatedReviews));
  };

  const handleClearReviews = () => {
    if (!window.confirm('Are you sure you want to delete all reviews? This action cannot be undone.')) {
      return;
    }
    
    setReviews([]);
    localStorage.removeItem(`product-${productId}-reviews`);
  };

  const StarRating = ({ value, interactive = false }: { value: number; interactive?: boolean }) => (
    <Stars>
      {[1, 2, 3, 4, 5].map((star) => (
        interactive ? (
          <StarInput
            key={star}
            checked={star <= value}
          >
            <input
              type="radio"
              name="rating"
              value={star}
              checked={star === value}
              onChange={() => setRating(star)}
            />
            <span style={{ 
              color: star <= value ? '#ecc94b' : '#cbd5e0',
              fontSize: '24px',
              lineHeight: 1
            }}>
              ★
            </span>
          </StarInput>
        ) : (
          <Star key={star} $filled={star <= value}>
            <span style={{ 
              color: star <= value ? '#ecc94b' : '#cbd5e0',
              fontSize: '20px',
              lineHeight: 1
            }}>
              ★
            </span>
          </Star>
        )
      ))}
    </Stars>
  );

  return (
    <Container>
      <Header>
        <Title>Customer Reviews</Title>
        {isAdmin && (
          <ClearReviewsButton onClick={handleClearReviews}>
            Clear All Reviews
          </ClearReviewsButton>
        )}
      </Header>

      <Form onSubmit={handleSubmit}>
        <ReviewerName>Posting as {userName}</ReviewerName>
        <RatingInput>
          <StarRating value={rating} interactive />
        </RatingInput>
        <TextArea
          placeholder="Share your experience with this product..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <SubmitButton type="submit">
          Submit Review
        </SubmitButton>
      </Form>

      <ReviewList>
        {reviews.map(review => (
          <ReviewItem key={review.id}>
            <ReviewHeader>
              <ReviewerInfo>
                <ReviewerName>{review.userName}</ReviewerName>
                <StarRating value={review.rating} />
              </ReviewerInfo>
              <ReviewDate>{review.date}</ReviewDate>
            </ReviewHeader>
            {editingReview?.id === review.id ? (
              <EditForm onSubmit={handleSaveEdit}>
                <EditTextArea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <SaveButton type="submit">Save</SaveButton>
                  <CancelButton type="button" onClick={() => setEditingReview(null)}>
                    Cancel
                  </CancelButton>
                </div>
              </EditForm>
            ) : (
              <>
                <Text>{review.text}</Text>
                {review.userId === userId && (
                  <ActionButtons>
                    <ActionButton 
                      type="button" 
                      onClick={() => handleEdit(review)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton 
                      type="button" 
                      $variant="delete"
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </ActionButton>
                  </ActionButtons>
                )}
              </>
            )}
          </ReviewItem>
        ))}
      </ReviewList>
    </Container>
  );
};

export default Reviews; 