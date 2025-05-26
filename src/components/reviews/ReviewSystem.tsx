
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Review } from '@/types/supabase';

interface ReviewSystemProps {
  groundId: string;
  userHasBooking?: boolean;
}

const ReviewSystem = ({ groundId, userHasBooking = false }: ReviewSystemProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    fetchUserReview();
  }, [groundId]);

  const fetchReviews = async () => {
    try {
      // Direct query without joins for now since reviews table might not be in schema
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('ground_id', groundId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } else {
        // Fetch user profiles separately
        const reviewsWithProfiles = await Promise.all(
          (data || []).map(async (review) => {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('first_name, last_name')
              .eq('id', review.user_id)
              .single();
            
            return {
              ...review,
              user_profiles: profile
            } as Review;
          })
        );
        setReviews(reviewsWithProfiles);
      }
    } catch (error) {
      console.error('Unexpected error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('ground_id', groundId)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setUserReview(data as Review);
        setNewRating(data.rating);
        setNewComment(data.comment || '');
      }
    } catch (error) {
      // User hasn't reviewed yet - this is fine
    }
  };

  const submitReview = async () => {
    if (newRating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a review.",
          variant: "destructive",
        });
        return;
      }

      const reviewData = {
        ground_id: groundId,
        user_id: user.id,
        rating: newRating,
        comment: newComment.trim() || null
      };

      let error;
      if (userReview) {
        // Update existing review
        ({ error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', userReview.id));
      } else {
        // Create new review
        ({ error } = await supabase
          .from('reviews')
          .insert(reviewData));
      }

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: userReview ? "Review updated successfully!" : "Review submitted successfully!",
        });
        fetchReviews();
        fetchUserReview();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, size: string = "w-5 h-5") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setNewRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Reviews & Ratings
            <span className="text-sm font-normal text-muted-foreground">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{averageRating}</div>
            {renderStars(Math.round(parseFloat(averageRating)))}
            <span className="text-muted-foreground">out of 5</span>
          </div>
        </CardContent>
      </Card>

      {/* Submit Review Form (only for users with bookings) */}
      {userHasBooking && (
        <Card>
          <CardHeader>
            <CardTitle>{userReview ? 'Update Your Review' : 'Leave a Review'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              {renderStars(newRating, true)}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Your Comment (Optional)</label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>
            <Button onClick={submitReview} disabled={submitting}>
              {submitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">
                      {review.user_profiles?.first_name} {review.user_profiles?.last_name}
                    </div>
                    {renderStars(review.rating, false, "w-4 h-4")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground mt-2">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
