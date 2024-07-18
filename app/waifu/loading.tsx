import SpinLoading from "@/app/components/ui/SpinLoading";

const loading = () => {
    return (
        <div className="flex min-h-[70vh] flex-col justify-center items-center">
            <SpinLoading />
        </div>
    );
};

export default loading;
