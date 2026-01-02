
export interface Scene {
  scene_number: number;
  visual_description: string;
  camera_motion: string;
  start_frame_prompt: string;
  end_frame_prompt: string;
  dialogue_or_narration: string;
  mood_and_lighting: string;
}

export interface Script {
  id: string;
  title: string;
  mode: string;
  person_name: string;
  visual_style: string;
  tone: string;
  scenes: Scene[];
  created_at: string;
}

export type ModeType = 'Birthday' | 'Anniversary' | 'Wedding' | 'General';
export type VisualStyleType = 'Realistic' | 'Anime' | 'Cyberpunk';
export type ToneType = 'Wholesome' | 'Exciting' | 'Cinematic';
