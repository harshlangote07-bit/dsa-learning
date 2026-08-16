export interface Hint {
  id: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HintsResponse {
  success: boolean;
  data: Hint[];
}

export interface ViewHintResponse {
  success: boolean;
  data: {
    hint: {
      id: string;
      content: string;
      order: number;
    };
    hintsViewed: number;
    alreadyViewed: boolean;
  };
}