const extras = [
	/* ========================================================================*
   *
   *                     Bonuses
   *
   * ========================================================================*/
	{
		name: 'bonus_extra_shot_1',
		max: 4,
		type: 'bonus',
	},
	{
		name: 'bonus_extra_shot_2',
		max: 6,
		type: 'bonus',
	},
	{
		name: 'bonus_laser_horizontal',
		max: 2,
		type: 'bonus',
	},
	{
		name: 'bonus_laser_vertical',
		max: 2,
		type: 'bonus',
	},
	{
		name: 'bonus_move_ship',
		max: 2,
		type: 'bonus',
	},
	{
		name: 'bonus_repair_ship',
		max: 2,
		type: 'bonus',
	},
	{
		name: 'bonus_superblast',
		max: 3,
		type: 'bonus',
	},
	{
		name: 'bonus_radar',
		max: 3,
		type: 'bonus',
		isBeforeShot: true,
	},
	/* ========================================================================*
   *
   *                     Penalties
   *
   * ========================================================================*/
	{
		name: 'penalty_mirror',
		max: 3,
		type: 'penalty',
	},
	{
		name: 'penalty_ricochet',
		max: 4,
		type: 'penalty',
	},
	{
		name: 'penalty_question',
		max: 4,
		type: 'penalty',
		isBeforeShot: true,
	},
];

export default extras;
