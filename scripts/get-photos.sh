#!/usr/bin/env bash
# Downloads staff photos from the current mttamrc.com site into images/team/
# so the new site no longer depends on the old WordPress site.
set -e
cd "$(dirname "$0")/../images/team"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/BO.jpeg" -o "shibu-lal.jpg" || echo "Could not fetch shibu-lal"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/Picture5.jpg" -o "steve-summer.jpg" || echo "Could not fetch steve-summer"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/09/Untitled-800-x-1200-px.jpg" -o "juanito-guzman.jpg" || echo "Could not fetch juanito-guzman"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/Kaitlyn.jpg" -o "kaitlyn-larkin.jpg" || echo "Could not fetch kaitlyn-larkin"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/Vince.jpg" -o "vince-truong.jpg" || echo "Could not fetch vince-truong"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/Robert.jpg" -o "bob-collins.jpg" || echo "Could not fetch bob-collins"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/Vicki.jpg" -o "vicky-cunningham.jpg" || echo "Could not fetch vicky-cunningham"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/Jesus.jpg" -o "jesus-vara.jpg" || echo "Could not fetch jesus-vara"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/Gladys.jpg" -o "gladys-calle.jpg" || echo "Could not fetch gladys-calle"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/Victoria.jpg" -o "victoria-calle.jpg" || echo "Could not fetch victoria-calle"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/jodie.jpg" -o "jodie-hawley.jpg" || echo "Could not fetch jodie-hawley"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/Angela-1.jpg" -o "angela-downs.jpg" || echo "Could not fetch angela-downs"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/Picture3.jpg" -o "beth-zamichow.jpg" || echo "Could not fetch beth-zamichow"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/Claire.jpg" -o "claire-cohn.jpg" || echo "Could not fetch claire-cohn"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/lynette.png" -o "lynnette-kling.jpg" || echo "Could not fetch lynnette-kling"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/al.jpg" -o "al-loren.jpg" || echo "Could not fetch al-loren"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/02/kelley.png" -o "kelley-busby.jpg" || echo "Could not fetch kelley-busby"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/David-rotated.jpg" -o "david-bearden.jpg" || echo "Could not fetch david-bearden"
curl -fsSL "https://mttamrc.com/wp-content/uploads/2025/03/Kevin.jpg" -o "kevin-michaels.jpg" || echo "Could not fetch kevin-michaels"
