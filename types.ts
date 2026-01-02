
export interface Scene {
  scene_number: number;
  visual_description: string;
  camera_motion: string;
  start_frame_scene: string;
  start_frame_style: string;
  end_frame_scene: string;
  end_frame_style: string;
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
export type VisualStyleType = 'Realistic' | 'Anime' | 'Cyberpunk' | 'Ghibli Cinematic';
export type ToneType = 'Wholesome' | 'Exciting' | 'Cinematic' | 'Dramatic';
