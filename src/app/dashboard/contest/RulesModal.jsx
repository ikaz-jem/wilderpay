import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import BorderEffect from '../components/BorderEffect/BorderEffect'
import ButtonPrimary from '@/app/components/ButtonPrimary'

export default function RulesModal({ title = "Contest Rules", text }) {
  let [isOpen, setIsOpen] = useState(false)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return (
    <>
      {
        text ? (
          <p
            className="text-xs !text-primary cursor-pointer hover:!underline hover:!text-accent"
            onClick={open}
          >
            {text}
          </p>
        ) : (
          <Button
            onClick={open}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
          >
            Contest Rules
          </Button>
        )
      }

      <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 backdrop-blur-md">
            <DialogPanel
              transition
              className="w-full max-w-4xl rounded border border-primary/10 bg-black p-6 backdrop-blur-4xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 relative"
            >
              <BorderEffect />

              <DialogTitle as="h3" className="text-xl font-semibold text-white text-center mb-4">
                Contest Rules
              </DialogTitle>

              <div className="flex flex-col gap-4 text-sm text-neutral">

                {/* SECTION 1 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">1. Overview</p>
                  <p>
                    Participants earn a <strong>Total Score</strong> based on personal investments,
                    trading/transaction volume, and referral network activity. All activity from direct and
                    indirect referrals contributes to your Total Score.
                  </p>
                </div>

                {/* SECTION 2 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">2. Scoring System</p>
                  <p>
                    <strong>Total Score = Personal Investment Score + Personal Volume Score + Referral/Network Score</strong>
                  </p>
                </div>

                {/* SECTION 3 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">3. Eligibility Threshold</p>
                  <p>
                    A minimum of <strong>5,000 Total Score</strong> is required to qualify for any contest prize.
                  </p>
                </div>

                {/* SECTION 4 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">4. Winning Criteria</p>
                  <p className="mt-1"><strong>A. Top 10 Winners:</strong> The 10 participants with the highest Total Scores (above 5,000) will win secondary prizes , Iphones 17 Pro Max , Iphone 17 and Investment Packages.</p>
                  <p className="mt-1"><strong>B. Grand Prize — Mercedes GLE 350 Coupé:</strong> The participant with the highest score above <strong>100,000 Total Score</strong> will win the grand prize.</p>
                </div>

                {/* SECTION 5 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">5. Referral Rules</p>
                  <p>
                    Only activity from users who register through your referral link counts. Fraudulent or
                    artificial referrals will result in disqualification.
                  </p>
                </div>

                {/* SECTION 6 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">6. Contest Duration</p>
                  <p>
                    Scores are counted only during the official contest period. (Add your dates here.)
                  </p>
                </div>

                {/* SECTION 7 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">7. Disqualification</p>
                  <p>
                    Manipulating volume, creating fake referrals, or violating platform terms will lead to
                    disqualification and score removal.
                  </p>
                </div>

                {/* SECTION 8 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">8. Prize Distribution</p>
                  <p>
                    Winners will be announced within 7–14 days after the contest ends. The Mercedes winner
                    must pass identity verification and comply with legal and tax requirements.
                  </p>
                </div>

                {/* SECTION 9 */}
                <div>
                  <p className="text-primary font-semibold text-center mb-1">9. Acceptance of Rules</p>
                  <p>
                    By participating, you agree to all contest rules and platform terms.
                  </p>
                </div>

              </div>

              <div className="mt-6 text-center">
                <ButtonPrimary
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-inner shadow-white/10 data-hover:bg-gray-600"
                  onClick={close}
                >
                  Close
                </ButtonPrimary>
              </div>

            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
