
When ship is fully inside battlefield to not let it out
Battlefiled has an array of grid offsets

snap ship to nearest offset
move to next if moved half a cell

// [SNAP]
    activeProps.snapTargets ? position => { // Snap
      const iLen = activeProps.snapTargets.length;
      let snappedX = false,
        snappedY = false,
        i;



      for (i = 0; i < iLen && (!snappedX || !snappedY); i++) {
        const snapTarget = activeProps.snapTargets[i];




        if ((snapTarget.gravityXStart == null || position.left >= snapTarget.gravityXStart) &&
            (snapTarget.gravityXEnd == null || position.left <= snapTarget.gravityXEnd) &&
            (snapTarget.gravityYStart == null || position.top >= snapTarget.gravityYStart) &&
            (snapTarget.gravityYEnd == null || position.top <= snapTarget.gravityYEnd)) {
              
          if (!snappedX && snapTarget.x != null) {
            position.left = snapTarget.x;
            snappedX = true;
            i = -1; // Restart loop
          }

          if (!snappedY && snapTarget.y != null) {
            position.top = snapTarget.y;
            snappedY = true;
            i = -1; // Restart loop
          }
        }
      }

      position.snapped = snappedX || snappedY;
