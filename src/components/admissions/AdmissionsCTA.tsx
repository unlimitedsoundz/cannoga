import { CTA } from "@aalto-dx/react-modules";

export default function AdmissionsCTA() {
    return (
        <div className="my-12">
            <CTA
                title="Ready to Start Your Journey?"
                body="Create your portal account to begin your official application."
                cta={{
                    label: "Create Portal Account",
                    linkComponentProps: {
                        href: "/portal/account/register",
                    },
                }}
            />
        </div>
    );
}
