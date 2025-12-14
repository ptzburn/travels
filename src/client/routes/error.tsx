import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/client/components/ui/alert.tsx";
import CircleAlert from "lucide-solid/icons/circle-alert";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import { Card, CardContent, CardFooter } from "../components/ui/card.tsx";
import { A, useSearchParams } from "@solidjs/router";
import { Button } from "../components/ui/button.tsx";

function ErrorPage() {
  const [searchParams, _] = useSearchParams();
  const error = searchParams.error || "An unknown error occured";
  return (
    <Card class="container mx-auto mt-4 flex min-h-72 flex-col items-center justify-center">
      <CardContent class="min-w-1/2">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Oh no!</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <A href="/">
          <Button>
            Home <ArrowLeft />
          </Button>
        </A>
      </CardFooter>
    </Card>
  );
}

export default ErrorPage;
