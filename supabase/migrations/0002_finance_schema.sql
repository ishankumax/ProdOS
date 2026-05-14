-- ── Earnings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  source text NOT NULL,
  amount numeric(12, 2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── Expenses ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric(12, 2) NOT NULL DEFAULT 0,
  type text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── Bills ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric(12, 2) NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'Unpaid',
  recurring boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── RLS ───────────────────────────────────────────────────────
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "earnings: owner access" ON earnings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "expenses: owner access" ON expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "bills: owner access" ON bills FOR ALL USING (auth.uid() = user_id);

-- ── Triggers ──────────────────────────────────────────────────
CREATE TRIGGER set_earnings_updated_at BEFORE UPDATE ON earnings FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
