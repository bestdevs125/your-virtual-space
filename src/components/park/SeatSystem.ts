export interface SeatSpot {
  id: string;
  houseId: string;
  worldPosition: [number, number, number];
  seatCameraPos: [number, number, number]; // where camera goes when sitting
  lookAt: [number, number, number]; // where camera looks when sitting
  label: string;
}

export function getHouseSeats(houseId: string, position: [number, number, number], width: number, depth: number): SeatSpot[] {
  const [hx, , hz] = position;

  return [
    {
      id: `${houseId}-sofa-left`,
      houseId,
      worldPosition: [hx - 0.45, 0.55, hz - depth / 2 + 0.7],
      seatCameraPos: [hx - 0.45, 1.0, hz - depth / 2 + 0.7],
      lookAt: [hx, 0.5, hz + depth / 2],
      label: '🛋️ Sofa (Left)',
    },
    {
      id: `${houseId}-sofa-right`,
      houseId,
      worldPosition: [hx + 0.45, 0.55, hz - depth / 2 + 0.7],
      seatCameraPos: [hx + 0.45, 1.0, hz - depth / 2 + 0.7],
      lookAt: [hx, 0.5, hz + depth / 2],
      label: '🛋️ Sofa (Right)',
    },
    {
      id: `${houseId}-chair-left`,
      houseId,
      worldPosition: [hx - width / 2 + 0.8, 0.35, hz + 0.3],
      seatCameraPos: [hx - width / 2 + 0.8, 0.85, hz + 0.3],
      lookAt: [hx, 0.5, hz],
      label: '🪑 Chair (Left)',
    },
    {
      id: `${houseId}-chair-right`,
      houseId,
      worldPosition: [hx + width / 2 - 0.8, 0.35, hz + 0.3],
      seatCameraPos: [hx + width / 2 - 0.8, 0.85, hz + 0.3],
      lookAt: [hx, 0.5, hz],
      label: '🪑 Chair (Right)',
    },
  ];
}
